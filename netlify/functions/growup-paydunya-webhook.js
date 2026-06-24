// GrowUp — PayDunya Webhook Handler
// Handles Wave, Orange Money, Moov Money payment confirmations (Côte d'Ivoire)

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

// Maps PayDunya invoice amounts to subscription tiers
const AMOUNT_MAP = {
  3279:  { tier: 'pro',   billing_period: 'monthly' },
  19672: { tier: 'pro',   billing_period: 'yearly'  },
  5895:  { tier: 'elite', billing_period: 'monthly' },
  32798: { tier: 'elite', billing_period: 'yearly'  },
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    // Verify PayDunya hash
    const hash = crypto
      .createHmac('sha512', process.env.PAYDUNYA_MASTER_KEY || '')
      .update(event.body)
      .digest('hex');

    if (hash !== event.headers['x-paydunya-signature']) {
      console.warn('[paydunya-webhook] Invalid signature');
      return { statusCode: 400, body: 'Invalid signature' };
    }

    // Only process successful payments
    if (payload.status !== 'completed') {
      return { statusCode: 200, body: 'ok' };
    }

    const userId = payload.custom_data?.userId;
    const amount = parseInt(payload.invoice?.total_amount, 10);
    const plan = AMOUNT_MAP[amount];

    if (!userId || !plan) {
      console.warn('[paydunya-webhook] Unknown plan or missing userId', { amount, userId });
      return { statusCode: 200, body: 'ok' };
    }

    // Calculate subscription period (30 days for monthly, 365 for yearly)
    const now = new Date();
    const periodDays = plan.billing_period === 'yearly' ? 365 : 30;
    const periodEnd = new Date(now.getTime() + periodDays * 24 * 60 * 60 * 1000);

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      tier: plan.tier,
      billing_period: plan.billing_period,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
      status: 'active',
      updated_at: now.toISOString(),
    }, { onConflict: 'user_id' });

    console.log(`[paydunya-webhook] Subscription activated: ${plan.tier} for user ${userId}`);
    return { statusCode: 200, headers: CORS, body: 'ok' };
  } catch (err) {
    console.error('[paydunya-webhook] Error:', err.message);
    return { statusCode: 500, body: err.message };
  }
};

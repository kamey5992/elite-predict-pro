const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    let body;
    const ct = event.headers['content-type'] ?? '';
    if (ct.includes('application/json')) {
      body = JSON.parse(event.body ?? '{}');
    } else {
      const params = new URLSearchParams(event.body ?? '');
      body = Object.fromEntries(params.entries());
    }

    const status   = body.cpm_trans_status;
    const metadata = JSON.parse(body.cpm_custom ?? body.metadata ?? '{}');
    const { userId, priceKey } = metadata;

    if (status !== 'ACCEPTED' || !userId || !priceKey) {
      return { statusCode: 200, body: 'OK' };
    }

    const PRICE_META = {
      pro_monthly:   { tier: 'pro',   period: 'monthly' },
      pro_yearly:    { tier: 'pro',   period: 'yearly'  },
      elite_monthly: { tier: 'elite', period: 'monthly' },
      elite_yearly:  { tier: 'elite', period: 'yearly'  },
    };
    const plan = PRICE_META[priceKey];
    if (!plan) return { statusCode: 200, body: 'OK' };

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const now       = new Date();
    const periodEnd = new Date(now);
    if (plan.period === 'monthly') periodEnd.setMonth(periodEnd.getMonth() + 1);
    else                           periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    await supabase.from('subscriptions').upsert({
      user_id:              userId,
      tier:                 plan.tier,
      billing_period:       plan.period,
      status:               'active',
      current_period_start: now.toISOString(),
      current_period_end:   periodEnd.toISOString(),
      updated_at:           now.toISOString(),
    }, { onConflict: 'user_id' });

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('cinetpay-notify error:', err);
    return { statusCode: 500, body: 'Error' };
  }
};

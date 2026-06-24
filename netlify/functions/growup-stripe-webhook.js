// GrowUp — Stripe Webhook Handler
// Listens for: checkout.session.completed, subscription.updated, subscription.deleted

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getTier(priceId) {
  const pro = [process.env.STRIPE_PRICE_PRO_MONTHLY, process.env.STRIPE_PRICE_PRO_YEARLY];
  const elite = [process.env.STRIPE_PRICE_ELITE_MONTHLY, process.env.STRIPE_PRICE_ELITE_YEARLY];
  if (pro.includes(priceId)) return 'pro';
  if (elite.includes(priceId)) return 'elite';
  return 'free';
}

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[webhook] signature error:', err.message);
    return { statusCode: 400, body: `Webhook error: ${err.message}` };
  }

  const { type, data } = stripeEvent;
  const obj = data.object;

  try {
    if (type === 'checkout.session.completed') {
      const userId = obj.metadata?.userId;
      if (!userId || !obj.subscription) return { statusCode: 200, body: 'ok' };

      const sub = await stripe.subscriptions.retrieve(obj.subscription);
      const priceId = sub.items.data[0]?.price?.id;
      const interval = sub.items.data[0]?.price?.recurring?.interval;

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        tier: getTier(priceId),
        billing_period: interval === 'year' ? 'yearly' : 'monthly',
        stripe_customer_id: obj.customer,
        stripe_subscription_id: obj.subscription,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end,
        status: sub.status,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    if (type === 'customer.subscription.updated') {
      const priceId = obj.items?.data[0]?.price?.id;
      const interval = obj.items?.data[0]?.price?.recurring?.interval;

      await supabase.from('subscriptions')
        .update({
          tier: getTier(priceId),
          billing_period: interval === 'year' ? 'yearly' : 'monthly',
          status: obj.status,
          current_period_start: new Date(obj.current_period_start * 1000).toISOString(),
          current_period_end: new Date(obj.current_period_end * 1000).toISOString(),
          cancel_at_period_end: obj.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', obj.id);
    }

    if (type === 'customer.subscription.deleted') {
      await supabase.from('subscriptions')
        .update({ tier: 'free', status: 'canceled', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', obj.id);
    }

    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error('[webhook] db error:', err.message);
    return { statusCode: 500, body: err.message };
  }
};

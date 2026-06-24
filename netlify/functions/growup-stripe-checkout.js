// GrowUp — Create Stripe Checkout Session
// POST body: { priceId, userId, userEmail }

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const SITE_URL = process.env.URL || 'https://elite-predict-pro.netlify.app';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { priceId, userId, userEmail } = JSON.parse(event.body || '{}');

    if (!priceId || !userId) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'priceId and userId are required' }) };
    }

    // payment_method: PayDunya handles Wave, Orange Money, Moov Money for CI market.
    // Stripe handles card (Visa/Mastercard). We support both via separate flows.
    const paymentMethod = JSON.parse(event.body || '{}').paymentMethod || 'stripe';

    if (paymentMethod === 'paydunya') {
      // PayDunya integration for West Africa mobile money (Wave, Orange Money, Moov Money)
      const PAYDUNYA_MASTER_KEY = process.env.PAYDUNYA_MASTER_KEY;
      const PAYDUNYA_PRIVATE_KEY = process.env.PAYDUNYA_PRIVATE_KEY;
      const PAYDUNYA_TOKEN = process.env.PAYDUNYA_TOKEN;

      if (!PAYDUNYA_MASTER_KEY) {
        return {
          statusCode: 400,
          headers: CORS,
          body: JSON.stringify({ error: 'PayDunya non configuré. Contacte le support.' }),
        };
      }

      // Get price amount from priceId lookup
      const PRICE_MAP = {
        [process.env.STRIPE_PRICE_PRO_MONTHLY]: { amount: 3279, label: 'GrowUp Pro Mensuel' },    // 4.99€ ≈ 3,279 XOF
        [process.env.STRIPE_PRICE_PRO_YEARLY]: { amount: 19672, label: 'GrowUp Pro Annuel' },      // 29.99€ ≈ 19,672 XOF
        [process.env.STRIPE_PRICE_ELITE_MONTHLY]: { amount: 5895, label: 'GrowUp Elite Mensuel' }, // 8.99€ ≈ 5,895 XOF
        [process.env.STRIPE_PRICE_ELITE_YEARLY]: { amount: 32798, label: 'GrowUp Elite Annuel' },  // 49.99€ ≈ 32,798 XOF
      };

      const item = PRICE_MAP[priceId];
      if (!item) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Plan invalide' }) };

      const paydunyaRes = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
          'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
          'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
        },
        body: JSON.stringify({
          invoice: {
            total_amount: item.amount,
            description: item.label,
          },
          store: { name: 'GrowUp' },
          custom_data: { userId },
          actions: {
            return_url: `${SITE_URL}/growup-demo.html?payment=success`,
            cancel_url: `${SITE_URL}/growup-demo.html?payment=cancel`,
            callback_url: `${SITE_URL}/.netlify/functions/growup-paydunya-webhook`,
          },
        }),
      });

      const paydunyaData = await paydunyaRes.json();
      if (paydunyaData.response_code !== '00') {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: paydunyaData.response_text }) };
      }

      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ url: paydunyaData.response_text }),
      };
    }

    // Default: Stripe (card)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: userEmail || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/growup-demo.html?payment=success`,
      cancel_url: `${SITE_URL}/growup-demo.html?payment=cancel`,
      metadata: { userId },
      subscription_data: {
        metadata: { userId },
        trial_period_days: 7,
      },
      allow_promotion_codes: true,
    });

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('[growup-stripe-checkout]', err.message);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

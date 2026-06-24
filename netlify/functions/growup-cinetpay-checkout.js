const CINETPAY_APIKEY  = process.env.CINETPAY_APIKEY;
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID;
const SUPABASE_URL     = process.env.SUPABASE_URL;
const SUPABASE_SRK     = process.env.SUPABASE_SERVICE_ROLE_KEY;
const NETLIFY_URL      = process.env.EXPO_PUBLIC_NETLIFY_URL ?? 'https://elite-predict-pro.netlify.app';

// Prix en FCFA (XOF)
const PRICES = {
  pro_monthly:    3000,
  pro_yearly:    18000,
  elite_monthly:  5000,
  elite_yearly:  30000,
};

const PRICE_META = {
  pro_monthly:   { tier: 'pro',   period: 'monthly' },
  pro_yearly:    { tier: 'pro',   period: 'yearly'  },
  elite_monthly: { tier: 'elite', period: 'monthly' },
  elite_yearly:  { tier: 'elite', period: 'yearly'  },
};

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type':                 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  try {
    const { priceKey, userId, userEmail, userName } = JSON.parse(event.body ?? '{}');
    const amount = PRICES[priceKey];
    if (!amount) throw new Error('Clé de prix invalide');

    const transactionId = `gu_${priceKey}_${userId}_${Date.now()}`;

    const res = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey:         CINETPAY_APIKEY,
        site_id:        CINETPAY_SITE_ID,
        transaction_id: transactionId,
        amount,
        currency:       'XOF',
        description:    `GrowUp ${PRICE_META[priceKey].tier} (${PRICE_META[priceKey].period})`,
        return_url:     `${NETLIFY_URL}/growup-demo.html?payment=success`,
        notify_url:     `${NETLIFY_URL}/.netlify/functions/growup-cinetpay-notify`,
        channels:       'ALL',
        customer_email: userEmail,
        customer_name:  userName || userEmail,
        metadata:       JSON.stringify({ userId, priceKey }),
      }),
    });

    const data = await res.json();
    if (data.code !== '201') throw new Error(data.message || 'Erreur CinetPay');

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ url: data.data.payment_url }) };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};

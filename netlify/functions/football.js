// Fonction Netlify — Proxy sécurisé vers football-data.org
// La clé API reste côté serveur, jamais exposée dans le navigateur.

exports.handler = async (event) => {
  const key = process.env.FOOTBALL_DATA_KEY;
  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "FOOTBALL_DATA_KEY manquante dans les variables d'environnement Netlify." })
    };
  }

  const params = event.queryStringParameters || {};
  const comp   = params.comp;   // ex: WC, CL, PL, FL1, PD, BL1
  const status = params.status; // LIVE, SCHEDULED, FINISHED, IN_PLAY, PAUSED

  // Plage du jour (UTC)
  const now    = new Date();
  const today  = now.toISOString().split("T")[0];

  let url;
  if (comp && comp !== "ALL") {
    url = "https://api.football-data.org/v4/competitions/" + comp + "/matches?dateFrom=" + today + "&dateTo=" + today;
  } else {
    url = "https://api.football-data.org/v4/matches?dateFrom=" + today + "&dateTo=" + today;
  }
  if (status) url += "&status=" + status;

  try {
    const res  = await fetch(url, { headers: { "X-Auth-Token": key } });
    const data = await res.json();

    return {
      statusCode: res.ok ? 200 : res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

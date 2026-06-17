// Proxy ESPN Basketball — aucune clé requise
exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const league = params.league || 'nba';

  const slugs = {
    nba:        'basketball/nba',
    euroleague: 'basketball/mens-euroleague',
    wnba:       'basketball/wnba',
    nba2:       'basketball/nba-g-league',
  };
  const slug = slugs[league] || 'basketball/nba';
  const url  = `https://site.api.espn.com/apis/site/v2/sports/${slug}/scoreboard`;

  try {
    const res  = await fetch(url);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

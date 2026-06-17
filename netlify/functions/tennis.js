// Proxy ESPN Tennis — aucune clé requise
exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const tour   = params.tour || 'atp';

  const slugs = {
    atp:        'tennis/atp',
    wta:        'tennis/wta',
    grandslam:  'tennis/grand-slam',
    masters:    'tennis/atp',
  };
  const slug = slugs[tour] || 'tennis/atp';
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

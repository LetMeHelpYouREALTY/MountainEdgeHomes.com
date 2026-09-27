const { submitLeadToFub, parseRequestBody } = require('./lib/submit-lead');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = parseRequestBody(req);
  if (body === null) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const result = await submitLeadToFub({
    body,
    referer: req.headers.referer || req.headers.referrer,
    apiKey: process.env.FOLLOW_UP_BOSS_API_KEY,
  });

  if (result.log) {
    console.error(result.log);
  }

  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }

  return res.status(200).json({ success: true });
};

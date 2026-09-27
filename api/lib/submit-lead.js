const SITE_SOURCE = 'mountainedgehomes.com';

function splitName(fullName) {
  const trimmed = (fullName || '').trim();
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

function validateLeadBody(body) {
  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return { ok: false, status: 400, error: 'Request body is required' };
  }

  const name = (body.name || body.fullName || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();

  if (!name) {
    return { ok: false, status: 400, error: 'Name is required' };
  }
  if (!email && !phone) {
    return { ok: false, status: 400, error: 'Email or phone is required' };
  }

  return { ok: true, name, email, phone };
}

function buildMessage(body) {
  const parts = [];
  if (body.message && String(body.message).trim()) {
    parts.push(String(body.message).trim());
  }
  const summaryFields = [
    ['interest', 'Interest'],
    ['neighborhood', 'Neighborhood'],
    ['propertyAddress', 'Property address'],
    ['propertyId', 'Property ID'],
    ['timeline', 'Timeline'],
    ['budget', 'Budget'],
  ];
  for (const [key, label] of summaryFields) {
    if (body[key] && String(body[key]).trim()) {
      parts.push(`${label}: ${String(body[key]).trim()}`);
    }
  }
  return parts.join('\n') || 'Website inquiry';
}

function buildFubEvent(body, referer) {
  const { firstName, lastName } = splitName(body.name || body.fullName);
  const formName = (body.formName || body.description || 'Website Form').trim();
  const type = (body.type || 'General Inquiry').trim();
  const sourceUrl =
    (body.sourceUrl && String(body.sourceUrl).trim()) ||
    referer ||
    `https://www.${SITE_SOURCE}/`;

  const person = {
    firstName,
    lastName,
    emails: body.email ? [{ value: String(body.email).trim() }] : [],
    phones: body.phone ? [{ value: String(body.phone).trim() }] : [],
    tags: [SITE_SOURCE, formName],
  };

  return {
    source: SITE_SOURCE,
    system: SITE_SOURCE,
    type,
    message: buildMessage(body),
    description: formName,
    sourceUrl,
    person,
  };
}

async function submitLeadToFub({ body, referer, apiKey, fetchImpl }) {
  const validation = validateLeadBody(body);
  if (!validation.ok) {
    return { ok: false, status: validation.status, error: validation.error };
  }

  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error: 'Lead capture is temporarily unavailable',
      log: 'FOLLOW_UP_BOSS_API_KEY is not configured for mountainedgehomes.com lead API',
    };
  }

  const eventPayload = buildFubEvent({ ...body, ...validation }, referer);
  const fetchFn = fetchImpl || fetch;

  try {
    const response = await fetchFn('https://api.followupboss.com/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'X-System': SITE_SOURCE,
      },
      body: JSON.stringify(eventPayload),
    });

    if (!response.ok) {
      return {
        ok: false,
        status: 502,
        error: 'Failed to submit lead',
        log: `Follow Up Boss API error: HTTP ${response.status}`,
      };
    }

    return { ok: true, status: 200, eventPayload };
  } catch {
    return {
      ok: false,
      status: 502,
      error: 'Failed to submit lead',
      log: 'Follow Up Boss API request failed',
    };
  }
}

function parseRequestBody(req) {
  if (req.body === undefined || req.body === null || req.body === '') {
    return {};
  }
  if (typeof req.body === 'object') {
    return req.body;
  }
  try {
    return JSON.parse(req.body);
  } catch {
    return null;
  }
}

module.exports = {
  SITE_SOURCE,
  validateLeadBody,
  buildFubEvent,
  submitLeadToFub,
  parseRequestBody,
};

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateLeadBody, buildFubEvent, submitLeadToFub } = require('./submit-lead');

describe('validateLeadBody', () => {
  it('rejects empty object with 400 semantics', () => {
    const result = validateLeadBody({});
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });

  it('requires name and email or phone', () => {
    assert.equal(validateLeadBody({ name: 'Jan Duffy' }).ok, false);
    assert.equal(validateLeadBody({ email: 'a@b.com' }).ok, false);
    assert.equal(validateLeadBody({ name: 'Jan', email: 'a@b.com' }).ok, true);
  });
});

describe('buildFubEvent', () => {
  it('maps contact fields to FUB events payload', () => {
    const event = buildFubEvent(
      {
        name: 'Jane Buyer',
        email: 'jane@example.com',
        phone: '7025551212',
        message: 'Hello',
        type: 'General Inquiry',
        formName: 'Contact',
        sourceUrl: 'https://mountainedgehomes.com/index.html',
      },
      'https://mountainedgehomes.com/index.html'
    );
    assert.equal(event.source, 'mountainedgehomes.com');
    assert.equal(event.type, 'General Inquiry');
    assert.equal(event.person.firstName, 'Jane');
    assert.equal(event.person.lastName, 'Buyer');
    assert.deepEqual(event.person.tags, ['mountainedgehomes.com', 'Contact']);
  });
});

describe('submitLeadToFub', () => {
  it('posts to FUB events with Basic auth and mocked fetch', async () => {
    let capturedUrl;
    let capturedInit;
    const mockFetch = async (url, init) => {
      capturedUrl = url;
      capturedInit = init;
      return { ok: true, status: 201 };
    };

    const result = await submitLeadToFub({
      body: { name: 'Test User', email: 'test@example.com', type: 'General Inquiry' },
      referer: 'https://mountainedgehomes.com/',
      apiKey: 'test_api_key_not_real',
      fetchImpl: mockFetch,
    });

    assert.equal(result.ok, true);
    assert.equal(capturedUrl, 'https://api.followupboss.com/v1/events');
    assert.match(capturedInit.headers.Authorization, /^Basic /);
    assert.doesNotMatch(capturedInit.headers.Authorization, /fka_/);
    const payload = JSON.parse(capturedInit.body);
    assert.equal(payload.system, 'mountainedgehomes.com');
  });

  it('returns 503 when API key is missing', async () => {
    const result = await submitLeadToFub({
      body: { name: 'Test', email: 't@e.com' },
      apiKey: '',
      fetchImpl: async () => ({ ok: true }),
    });
    assert.equal(result.ok, false);
    assert.equal(result.status, 503);
  });
});

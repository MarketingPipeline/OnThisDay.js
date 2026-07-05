import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { normalizeItem, normalize, packageRaw, OnThisDay } from '../onthisday.js';
import { july4All, missingFields, emptyResponse } from './fixtures.js';

function mockFetch(response) {
  global.fetch = typeof response === 'function'
    ? response
    : async () => ({ ok: true, status: 200, statusText: 'OK', json: async () => response });
}

function mockFetchError(status, statusText) {
  global.fetch = async () => ({ ok: false, status, statusText });
}

// ── normalizeItem ──

describe('normalizeItem()', () => {
  it('extracts year and text', () => {
    assert.deepStrictEqual(
      normalizeItem({ year: 1776, text: 'Declaration signed' }),
      { year: 1776, event: 'Declaration signed' }
    );
  });

  it('handles null/undefined/non-objects', () => {
    assert.deepStrictEqual(normalizeItem(null), { year: null, event: '' });
    assert.deepStrictEqual(normalizeItem(42), { year: null, event: '' });
    assert.deepStrictEqual(normalizeItem('x'), { year: null, event: '' });
  });

  it('handles partial items', () => {
    assert.deepStrictEqual(normalizeItem({ year: 2000 }), { year: 2000, event: '' });
    assert.deepStrictEqual(normalizeItem({ text: 'X' }), { year: null, event: 'X' });
  });

  it('handles year = 0', () => {
    assert.deepStrictEqual(normalizeItem({ year: 0, text: 'Year zero' }), { year: 0, event: 'Year zero' });
  });

  it('handles unicode text', () => {
    assert.deepStrictEqual(
      normalizeItem({ year: 1789, text: 'Révolution française 🗼' }),
      { year: 1789, event: 'Révolution française 🗼' }
    );
  });

  it('is idempotent', () => {
    const once = normalizeItem({ year: 2000, text: 'Event' });
    const twice = normalizeItem(once);
    assert.deepStrictEqual(once, twice);
  });

  it('handles fuzzed input', () => {
    for (let i = 0; i < 100; i++) {
      const input = Math.random() > 0.5
        ? { year: Math.floor(Math.random() * 6000) - 1000, text: String(Math.random()) }
        : Math.random() > 0.5 ? null : Math.random();
      const result = normalizeItem(input);
      assert.ok('year' in result && 'event' in result);
    }
  });
});

// ── normalize ──

describe('normalize()', () => {
  it('normalizes all types', () => {
    const r = normalize(july4All);
    assert.deepStrictEqual(r.events[0], { year: 1776, event: july4All.events[0].text });
    assert.deepStrictEqual(r.births[0], { year: 1872, event: july4All.births[0].text });
    assert.deepStrictEqual(r.deaths[0], { year: 1826, event: july4All.deaths[0].text });
    assert.deepStrictEqual(r.holidays[0], { year: null, event: july4All.holidays[0].text });
    assert.deepStrictEqual(r.selected[0], { year: 1776, event: july4All.selected[0].text });
  });

  it('handles null data', () => {
    const r = normalize(null);
    assert.deepStrictEqual(r.events, []);
    assert.deepStrictEqual(r.births, []);
  });

  it('handles mixed valid + invalid items', () => {
    const r = normalize(missingFields);
    assert.strictEqual(r.events.length, 6);
    assert.ok(r.events.every(e => typeof e.event === 'string'));
  });

  it('is idempotent', () => {
    const input = { events: [{ year: 2000, text: 'Event' }] };
    assert.deepStrictEqual(normalize(input), normalize(normalize(input)));
  });
});

// ── packageRaw ──

describe('packageRaw()', () => {
  it('packages all', () => {
    const r = packageRaw(july4All);
    assert.strictEqual(r.events.length, 2);
    assert.strictEqual(r.births.length, 1);
  });

  it('handles null data', () => {
    const r = packageRaw(null);
    assert.deepStrictEqual(r.events, []);
  });
});

// ── OnThisDay input validation ──

describe('OnThisDay() input validation', () => {
  let originalFetch;

  before(() => {
    originalFetch = global.fetch;
    mockFetch([]);
  });

  after(() => {
    global.fetch = originalFetch;
  });

  it('no args → today', async () => {
    const r = await OnThisDay();
    assert.ok(r);
  });

  it('month and day', async () => {
    const r = await OnThisDay(7, 4);
    assert.ok(r);
  });

  it('coerces string numbers', async () => {
    const r = await OnThisDay('7', '4');
    assert.ok(r);
  });

  it('with options', async () => {
    const r = await OnThisDay(7, 4, { lang: 'es', timeout: 5000 });
    assert.ok(r);
  });

  it('throws if only month provided', async () => {
    await assert.rejects(async () => OnThisDay(7), /both month and day/);
  });

  it('throws on invalid month', async () => {
    await assert.rejects(async () => OnThisDay(0, 1), /Invalid month/);
    await assert.rejects(async () => OnThisDay(13, 1), /Invalid month/);
  });

  it('throws on invalid day', async () => {
    await assert.rejects(async () => OnThisDay(1, 0), /Invalid day/);
    await assert.rejects(async () => OnThisDay(1, 32), /Invalid day/);
  });

  it('throws on impossible date', async () => {
    await assert.rejects(async () => OnThisDay(2, 30), /Invalid date/);
    await assert.rejects(async () => OnThisDay(4, 31), /Invalid date/);
  });

  it('accepts Jan 1', async () => {
    const r = await OnThisDay(1, 1);
    assert.ok(r);
  });

  it('accepts Dec 31', async () => {
    const r = await OnThisDay(12, 31);
    assert.ok(r);
  });

  it('throws on unsupported lang', async () => {
    await assert.rejects(async () => OnThisDay(7, 4, { lang: 'ja' }), /Unsupported language/);
  });

  it('throws on empty lang', async () => {
    await assert.rejects(async () => OnThisDay(7, 4, { lang: '' }), /Unsupported language/);
  });
});

// ── OnThisDay integration ──

describe('OnThisDay() integration', () => {
  let originalFetch;

  before(() => {
    originalFetch = global.fetch;
  });

  after(() => {
    global.fetch = originalFetch;
  });

  it('fetches all types', async () => {
    mockFetch(july4All);
    const r = await OnThisDay(7, 4);
    assert.strictEqual(r.getEvents().length, 2);
    assert.strictEqual(r.getBirths().length, 1);
    assert.strictEqual(r.getDeaths().length, 2);
    assert.strictEqual(r.getHolidays().length, 1);
    assert.strictEqual(r.getSelected().length, 1);
  });

  it('asserts URL uses /all/', async () => {
    let url;
    mockFetch(u => { url = u; return { ok: true, status: 200, statusText: 'OK', json: async () => [] }; });
    await OnThisDay(7, 4, { lang: 'es' });
    assert.ok(url.includes('/es/'));
    assert.ok(url.includes('/all/'));
    assert.ok(url.includes('/07/04'));
  });

  it('throws on 404', async () => {
    mockFetchError(404, 'Not Found');
    await assert.rejects(async () => OnThisDay(7, 4), /No data found/);
  });

  it('throws on API error', async () => {
    mockFetchError(500, 'Internal Server Error');
    await assert.rejects(async () => OnThisDay(7, 4), /Wikimedia API error 500/);
  });

  it('handles network error', async () => {
    mockFetch(async () => { throw new Error('net::ERR_CONNECTION_REFUSED'); });
    await assert.rejects(async () => OnThisDay(7, 4), /Network error/);
  });

  it('handles invalid JSON', async () => {
    mockFetch(async () => ({ ok: true, status: 200, statusText: 'OK', json: async () => { throw new Error('bad'); } }));
    await assert.rejects(async () => OnThisDay(7, 4), /Invalid JSON response/);
  });

  it('handles null arrays', async () => {
    mockFetch({ events: null });
    const r = await OnThisDay(7, 4);
    assert.deepStrictEqual(r.getEvents(), []);
  });

  it('handles null items', async () => {
    mockFetch({ events: [null, { year: 2000, text: 'OK' }] });
    const r = await OnThisDay(7, 4);
    assert.strictEqual(r.getEvents().length, 2);
    assert.deepStrictEqual(r.getEvents()[0], { year: null, event: '' });
  });

  it('getters are immutable', async () => {
    mockFetch(july4All);
    const r = await OnThisDay(7, 4);
    r.getEvents().push({ hack: true });
    assert.strictEqual(r.getEvents().length, 2);
    r.getAll().events.push({ hack: true });
    assert.strictEqual(r.getAll().events.length, 2);
  });

  it('handles concurrency', async () => {
    let count = 0;
    mockFetch(async () => { count++; return { ok: true, status: 200, json: async () => emptyResponse }; });
    const results = await Promise.all([OnThisDay(7, 4), OnThisDay(12, 25), OnThisDay(1, 1)]);
    assert.strictEqual(results.length, 3);
    assert.strictEqual(count, 3);
  });

  it('handles large dataset', async () => {
    mockFetch({ events: Array.from({ length: 1000 }, (_, i) => ({ year: i, text: `E${i}` })) });
    const r = await OnThisDay(7, 4);
    assert.strictEqual(r.getEvents().length, 1000);
    assert.strictEqual(r.getEvents()[999].year, 999);
  });

  it('aborts on timeout', async () => {
    mockFetch(async (_url, { signal }) => new Promise((resolve, reject) => {
      const t = setTimeout(() => resolve({ ok: true, status: 200, json: async () => [] }), 100);
      signal?.addEventListener('abort', () => { clearTimeout(t); const e = new Error('Aborted'); e.name = 'AbortError'; reject(e); });
    }));
    const start = Date.now();
    await assert.rejects(async () => OnThisDay(7, 4, { timeout: 1 }), /timed out/);
    assert.ok(Date.now() - start < 100);
  });
});

// ── Live API (optional) ──

const RUN_LIVE = process.env.LIVE_API === 'true';

(RUN_LIVE ? describe : describe.skip)('Live API', () => {
  it('fetches real events', { timeout: 15000 }, async () => {
    const r = await OnThisDay(7, 4);
    const events = r.getEvents();
    assert.ok(events.length > 0);
    assert.ok(events.every(e => typeof e.event === 'string'));
    assert.ok(events.every(e => Number.isInteger(e.year) || e.year === null));
  });

  it('fetches real data in Spanish', { timeout: 15000 }, async () => {
    const r = await OnThisDay(7, 4, { lang: 'es' });
    assert.ok(Array.isArray(r.getEvents()));
  });

  it('API contract unchanged', { timeout: 15000 }, async () => {
    const res = await fetch('https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/07/04');
    const json = await res.json();
    for (const key of ['events', 'births', 'deaths', 'holidays', 'selected']) {
      assert.ok(key in json, `Missing key: ${key}`);
    }
  });
});

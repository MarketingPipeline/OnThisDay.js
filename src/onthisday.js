/**!
 * @license OnThisDay.js - A JavaScript library to find out what events happened today or any day in history.
 * VERSION: 3.0.0
 * CREATED BY: Jared Van Valkengoed
 * LICENSED UNDER MIT LICENSE
 * MORE INFO CAN BE FOUND AT https://github.com/MarketingPipeline/OnThisDay.js/
 */


const API_BASE = 'https://api.wikimedia.org/feed/v1/wikipedia';
const SUPPORTED_LANGS = ['en', 'es', 'de', 'fr', 'zh', 'ru', 'ar', 'pt', 'sv', 'tr', 'cs', 'uk'];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInMonth(month, year) {
  if (month === 2 && isLeapYear(year)) return 29;
  return DAYS_IN_MONTH[month - 1];
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function validateDate(month, day) {
  month = Number(month);
  day = Number(day);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Must be between 1 and 12.`);
  }
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}. Must be between 1 and 31.`);
  }

  const maxDays = getDaysInMonth(month, new Date().getFullYear());
  if (day > maxDays) {
    throw new Error(`Invalid date: ${month}/${day}. Month ${month} only has ${maxDays} days.`);
  }

  return { month: pad(month), day: pad(day) };
}

function validateLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) {
    throw new Error(`Unsupported language: "${lang}". Supported: ${SUPPORTED_LANGS.join(', ')}`);
  }
  return lang;
}

export function normalizeItem(item) {
  if (!item || typeof item !== 'object') {
    return { year: null, event: '' };
  }
  return {
    year: item.year ?? null,
    event: item.text ?? item.event ?? ''
  };
}

export function normalize(data) {
  const d = typeof data === 'object' && data !== null ? data : {};
  return {
    events:   (d.events   || []).map(normalizeItem),
    births:   (d.births   || []).map(normalizeItem),
    deaths:   (d.deaths   || []).map(normalizeItem),
    holidays: (d.holidays || []).map(normalizeItem),
    selected: (d.selected || []).map(normalizeItem)
  };
}

export function packageRaw(data) {
  const d = typeof data === 'object' && data !== null ? data : {};
  return {
    events:   d.events   || [],
    births:   d.births   || [],
    deaths:   d.deaths   || [],
    holidays: d.holidays || [],
    selected: d.selected || []
  };
}

/**
 * Fetch historical events for a given date.
 * @param {number} [month] - 1-12, or omit for today
 * @param {number} [day] - 1-31, or omit for today
 * @param {object} [options] - Options
 * @param {string} [options.lang='en'] - Language code
 * @param {number} [options.timeout=10000] - Request timeout in ms
 * @returns {Promise<object>}
 */
export async function OnThisDay(month, day, options = {}) {
  let m, d;

  if (month == null) {
    const now = new Date();
    m = pad(now.getMonth() + 1);
    d = pad(now.getDate());
  } else if (day == null) {
    throw new Error('Provide both month and day, or neither for today.');
  } else {
    ({ month: m, day: d } = validateDate(month, day));
  }

  const lang = validateLang(options.lang ?? 'en');
  const timeout = options.timeout ?? 10000;

  const url = `${API_BASE}/${encodeURIComponent(lang)}/onthisday/all/${m}/${d}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let res;
  try {
    res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'OnThisDay.js/4.3.0 (https://github.com/MarketingPipeline/OnThisDay.js)'
      }
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms.`);
    }
    throw new Error(`Network error: ${err.message}`);
  }
  clearTimeout(timeoutId);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`No data found for ${m}/${d} in language "${lang}".`);
    }
    throw new Error(`Wikimedia API error ${res.status}: ${res.statusText}`);
  }

  let raw;
  try {
    raw = await res.json();
  } catch (err) {
    throw new Error(`Invalid JSON response: ${err.message}`);
  }

  const normalized = normalize(raw);
  const rawStore = packageRaw(raw);

  return {
    getEvents:   () => [...normalized.events],
    getBirths:   () => [...normalized.births],
    getDeaths:   () => [...normalized.deaths],
    getHolidays: () => [...normalized.holidays],
    getSelected: () => [...normalized.selected],
    getAll:      () => ({ ...normalized, events: [...normalized.events], births: [...normalized.births], deaths: [...normalized.deaths], holidays: [...normalized.holidays], selected: [...normalized.selected] }),
    getRaw:      () => ({ ...rawStore, events: [...rawStore.events], births: [...rawStore.births], deaths: [...rawStore.deaths], holidays: [...rawStore.holidays], selected: [...rawStore.selected] }),
    ...normalized
  };
}

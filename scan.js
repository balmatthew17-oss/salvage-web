// Searches eBay UK for faulty consoles, controllers, RTX cards and laptops, reads what each
// seller says is wrong, and writes deals.json for the website. Runs on GitHub Actions.
//
//   EBAY_CLIENT_ID=... EBAY_CLIENT_SECRET=... node scan.js <output folder>

import fs from 'node:fs';
import path from 'node:path';
import {
  RULES, faultContext, boilerplate, justSpares, negated, alwaysJunk, consoleWords,
  startsWithAccessory, forConsole, padWords, comesWithPad, repairService, pcJunk,
} from './rules.js';

const OUT = process.argv[2] || 'out';
const CONFIG = JSON.parse(fs.readFileSync(new URL('./config.json', import.meta.url)));
const MAX_READS = 80;          // description reads per run (keeps well under eBay's daily limit)
const NOTES_KEEP = 1500;

const rx = p => new RegExp(p, 'i');
const TYPES = [
  { key: 'ps5', label: 'PS5', kind: 'CONSOLE', cat: '139971', q: '(ps5, playstation 5)',
    re: rx('\\b(ps\\s?5|play\\s?station\\s?5)\\b'), not: rx('\\b(ps\\s?5|play\\s?station\\s?5)\\s*pro\\b') },
  { key: 'ps5pro', label: 'PS5 Pro', kind: 'CONSOLE', cat: '139971', q: '(ps5 pro, playstation 5 pro)',
    re: rx('\\b(ps\\s?5|play\\s?station\\s?5)\\s*pro\\b') },
  { key: 'xsx', label: 'Series X', kind: 'CONSOLE', cat: '139971', q: 'xbox series x', re: rx('series\\s?x\\b') },
  { key: 'xss', label: 'Series S', kind: 'CONSOLE', cat: '139971', q: 'xbox series s', re: rx('series\\s?s\\b') },
  { key: 'ds', label: 'DualSense', kind: 'CONTROLLER', cat: '117042', q: '(dualsense, ps5 controller)',
    re: rx('dual\\s?sense|\\b(ps\\s?5|play\\s?station\\s?5)\\b') },
  { key: 'xpad', label: 'Xbox pad', kind: 'CONTROLLER', cat: '117042',
    q: '(xbox series controller, xbox wireless controller)', re: rx('\\bxbox\\b') },
  { key: 'rtx20', label: 'RTX 20', kind: 'GPU', cat: '27386', q: '(2060, 2070, 2080)', re: rx('\\b(rtx\\s?)?20[678]0\\b') },
  { key: 'rtx30', label: 'RTX 30', kind: 'GPU', cat: '27386', q: '(3050, 3060, 3070, 3080, 3090)', re: rx('\\b(rtx\\s?)?30[5-9]0\\b') },
  { key: 'rtx40', label: 'RTX 40', kind: 'GPU', cat: '27386', q: '(4060, 4070, 4080, 4090)', re: rx('\\b(rtx\\s?)?40[6-9]0\\b') },
  { key: 'rtx50', label: 'RTX 50', kind: 'GPU', cat: '27386', q: '(5060, 5070, 5080, 5090)', re: rx('\\b(rtx\\s?)?50[6-9]0\\b') },
  { key: 'laptop', label: 'RTX laptop', kind: 'LAPTOP', cat: '177', q: 'rtx',
    re: rx('\\brtx|\\b(20[678]0|30[5-8]0|40[5-9]0|50[5-9]0)\\b') },
];
const byKey = Object.fromEntries(TYPES.map(t => [t.key, t]));
const matches = (t, title) => t.re.test(title) && !(t.not && t.not.test(title));

// ---------- filters (same as the app) ----------
const isAccessory = t => alwaysJunk.test(t) ? true
  : consoleWords.test(t) ? false
  : startsWithAccessory.test(t) || forConsole.test(t);
const isControllerListing = t => padWords.test(t) && !consoleWords.test(t) && !comesWithPad.test(t);
const isConsoleListing = t => consoleWords.test(t) || !padWords.test(t);
const justSparesFull = new RegExp('^(?:' + justSpares.source + ')$', 'i');

// ---------- fault tags ----------
function analyse(title, kind, extra = []) {
  const rules = RULES.filter(r => r.kinds.includes(kind));
  const fromTitle = new Set(rules.filter(r => r.re.test(title)).map(r => r.label));
  const labels = [];
  for (const r of rules) {
    if ((fromTitle.has(r.label) || extra.includes(r.label)) && !labels.some(l => l.label === r.label)) {
      labels.push({ label: r.label, level: r.level });
    }
  }
  const powersOn = labels.some(l => l.label === 'Powers on');
  return labels.filter(l => !(powersOn && l.label === 'No power' && !fromTitle.has('No power')));
}

const decode = s => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&pound;/g, '£')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

function htmlToText(html) {
  return decode(html
    .replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>|<\/p>|<\/div>|<\/li>|<\/h\d>|<li[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' '));
}

const split = text => text.slice(0, 6000)
  .split(/\n+|(?<=[.!?])\s+|\s+[-–•*]\s+|\s{3,}/)
  .map(s => s.replace(/\s+/g, ' ').trim().replace(/^[-*• ]+|[-*• ]+$/g, ''))
  .filter(s => s.length >= 8 && s.length <= 400);

function readDescription(condition, html, kind) {
  const sentences = [...(condition ? split(condition) : []), ...(html ? split(htmlToText(html)) : [])];
  const fault = [...new Set(sentences.filter(s =>
    faultContext.test(s) && !boilerplate.test(s) && !justSparesFull.test(s)))];
  const text = fault.join('. ');
  const tags = [...new Set(RULES.filter(r => r.kinds.includes(kind)).filter(r =>
    r.label === 'Powers on'
      ? fault.some(s => r.re.test(s) && !negated.test(s))
      : r.re.test(text)).map(r => r.label))];
  const summary = fault.slice(0, 3)
    .map(s => s.length > 150 ? s.slice(0, 147).trimEnd() + '…' : s).join(' · ') || null;
  return { s: summary, t: tags };
}

function gpuModel(title) {
  const m = /\b(?:rtx\s?)?((?:20|30|40|50)[5-9]0)(\s?ti\b|\s?super\b)?/i.exec(title);
  if (!m) return null;
  const suf = (m[2] || '').trim().toLowerCase();
  return 'RTX ' + m[1] + (suf === 'ti' ? ' Ti' : suf === 'super' ? ' Super' : '');
}

// ---------- eBay ----------
let token = null;
async function getToken() {
  const id = process.env.EBAY_CLIENT_ID, secret = process.env.EBAY_CLIENT_SECRET;
  if (!id || !secret) throw new Error('EBAY_CLIENT_ID / EBAY_CLIENT_SECRET secrets are not set');
  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${id.trim()}:${secret.trim()}`).toString('base64'),
    },
    body: 'grant_type=client_credentials&scope=' + encodeURIComponent('https://api.ebay.com/oauth/api_scope'),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`eBay rejected the keys (${res.status} ${json.error || ''} ${json.error_description || ''})`);
  token = json.access_token;
}

async function api(url, retried = false) {
  if (!token) await getToken();
  const res = await fetch(url, {
    headers: { Authorization: 'Bearer ' + token, 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB', Accept: 'application/json' },
  });
  if (res.status === 401 && !retried) { token = null; return api(url, true); }
  if (!res.ok) throw new Error(`eBay error ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const ms = s => (s ? Date.parse(s) || null : null);
const num = o => (o && o.value != null ? parseFloat(o.value) : null);

function toDeal(o, type) {
  const opts = o.buyingOptions || [];
  const auction = opts.includes('AUCTION') && !opts.includes('FIXED_PRICE');
  const price = auction ? num(o.currentBidPrice) ?? num(o.price) : num(o.price) ?? num(o.currentBidPrice);
  if (price == null || !o.itemId || !o.title || !o.itemWebUrl) return null;
  const posts = (o.shippingOptions || []).map(s => num(s.shippingCost)).filter(v => v != null);
  return {
    id: o.itemId, title: o.title, type: type.key, kind: type.kind, price,
    postage: posts.length ? Math.min(...posts) : null,
    auction, bestOffer: opts.includes('BEST_OFFER'), bids: o.bidCount || 0,
    end: ms(o.itemEndDate), created: ms(o.itemCreationDate), url: o.itemWebUrl,
    image: o.image?.imageUrl || o.thumbnailImages?.[0]?.imageUrl || null,
    location: o.itemLocation?.city || o.itemLocation?.postalCode || null,
  };
}

async function search(type) {
  const max = CONFIG.ceiling[type.key];
  const filter = [`price:[5..${max}]`, 'priceCurrency:GBP', 'conditionIds:{7000}',
    'itemLocationCountry:GB', 'buyingOptions:{FIXED_PRICE|AUCTION}'].join(',');
  const url = 'https://api.ebay.com/buy/browse/v1/item_summary/search?q=' + encodeURIComponent(type.q) +
    '&category_ids=' + type.cat + '&filter=' + encodeURIComponent(filter) + '&sort=newlyListed&limit=100';
  const json = await api(url);
  const out = [];
  for (const o of json.itemSummaries || []) {
    let d = toDeal(o, type);
    if (!d || !matches(type, d.title) || repairService.test(d.title)) continue;
    const total = d.price + (d.postage || 0);
    if (type.kind === 'CONSOLE' && isControllerListing(d.title)) {
      const pad = matches(byKey.xpad, d.title) ? byKey.xpad : byKey.ds;
      if (total > CONFIG.ceiling[pad.key]) continue;
      d = { ...d, type: pad.key, kind: pad.kind };
    } else if (type.kind === 'CONSOLE' || type.kind === 'CONTROLLER') {
      if (type.kind === 'CONTROLLER' && isConsoleListing(d.title)) continue;
      if (isAccessory(d.title) || total > max) continue;
    } else if (pcJunk.test(d.title) || total > max) continue;
    out.push(d);
  }
  return out;
}

// ---------- run ----------
async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const notesFile = path.join(OUT, 'notes.json');
  let notes = {};
  try { notes = JSON.parse(fs.readFileSync(notesFile, 'utf8')); } catch {}

  const found = new Map();
  const errors = [];
  for (const t of TYPES) {
    if (CONFIG.enabled[t.key] === false) continue;
    try {
      for (const d of await search(t)) if (!found.has(d.id)) found.set(d.id, d);
    } catch (e) {
      errors.push(`${t.label}: ${e.message}`);
      if (/rejected the keys|secrets are not set/.test(e.message)) break;
    }
  }
  if (!found.size && errors.length) throw new Error(errors[0]);

  // Read descriptions for new listings, newest first, a few at a time.
  const toRead = [...found.values()].filter(d => !notes[d.id])
    .sort((a, b) => (b.created || 0) - (a.created || 0)).slice(0, MAX_READS);
  for (let i = 0; i < toRead.length; i += 5) {
    await Promise.all(toRead.slice(i, i + 5).map(async d => {
      try {
        const item = await api('https://api.ebay.com/buy/browse/v1/item/' + encodeURIComponent(d.id));
        notes[d.id] = readDescription(item.conditionDescription || null,
          item.description || item.shortDescription || null, d.kind);
      } catch { /* try again next run */ }
    }));
  }

  const deals = [...found.values()].map(d => {
    const n = notes[d.id];
    return {
      ...d,
      model: d.kind === 'GPU' || d.kind === 'LAPTOP' ? gpuModel(d.title) : null,
      tags: analyse(d.title, d.kind, n ? n.t : []),
      notes: n ? n.s : null,
    };
  });

  // Keep notes for current listings plus the most recent others.
  const keep = {};
  const ids = Object.keys(notes);
  for (const id of ids.slice(-NOTES_KEEP)) keep[id] = notes[id];
  for (const d of deals) if (notes[d.id]) keep[d.id] = notes[d.id];

  fs.writeFileSync(notesFile, JSON.stringify(keep));
  fs.writeFileSync(path.join(OUT, 'deals.json'), JSON.stringify({
    updated: Date.now(),
    types: TYPES.map(t => ({ key: t.key, label: t.label, kind: t.kind, ceiling: CONFIG.ceiling[t.key] })),
    defaults: CONFIG.defaults,
    errors,
    deals,
  }));
  console.log(`${deals.length} listings, ${toRead.length} descriptions read, ${errors.length} errors`);
  errors.forEach(e => console.log('  ' + e));
}

main().catch(e => {
  // Still publish, so the website can show what went wrong (e.g. missing or rejected keys).
  console.error(e.message);
  fs.mkdirSync(OUT, { recursive: true });
  const prevFile = path.join(OUT, 'deals.json');
  fs.writeFileSync(prevFile, JSON.stringify({
    updated: Date.now(),
    types: TYPES.map(t => ({ key: t.key, label: t.label, kind: t.kind, ceiling: CONFIG.ceiling[t.key] })),
    defaults: CONFIG.defaults, errors: [e.message], deals: [],
  }));
  if (!fs.existsSync(path.join(OUT, 'notes.json'))) fs.writeFileSync(path.join(OUT, 'notes.json'), '{}');
});

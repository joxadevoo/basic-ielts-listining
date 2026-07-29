// ==========================================================================
// api/generate-questions.js  (Vercel serverless function)
//
// One endpoint, three jobs against the Supabase `reading_passages` table:
//   POST                      -> generate questions for a passage with OpenAI,
//                                save the FULL passage + questions, return them.
//                                (Cache hit = 0 tokens.)
//   GET  ?list=1              -> list saved passages (for the selector).
//   GET  ?hash=<passage_hash> -> load one saved passage (paragraphs + questions).
//
// Secrets (server-side only — never VITE_):
//   OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY, (optional) OPENAI_MODEL
//
// Graceful degradation: missing OpenAI key or any error on POST returns
// { ok:false, fallback:true } so the client keeps its free gap-fill questions.
// Missing Supabase creds -> generation still works, just nothing is saved/listed.
// ==========================================================================

import { createHash } from 'node:crypto';

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const TABLE = 'reading_passages';

function resolveCorsOrigin(req) {
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) return origin;
  return allowed[0] || '*';
}

function getQuery(req) {
  try {
    if (req.query) return req.query;
    const u = new URL(req.url, 'http://localhost');
    return Object.fromEntries(u.searchParams.entries());
  } catch {
    return {};
  }
}

function hashPassage(paragraphs, types) {
  const basis = JSON.stringify({
    p: paragraphs.map(p => `${p.marker}:${p.text}`),
    t: types,
    m: OPENAI_MODEL
  });
  return createHash('sha256').update(basis).digest('hex');
}

// ---- Supabase (PostgREST via fetch, no SDK) ----
function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}
function sbHeaders(extra = {}) {
  return {
    apikey: process.env.SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    ...extra
  };
}

// Map a DB row to the passage object shape the client uses.
function rowToPassage(row) {
  return {
    id: `db:${row.passage_hash}`,
    hash: row.passage_hash,
    title: row.title,
    subtitle: row.subtitle,
    level: row.level,
    stage: row.stage,
    wordCount: row.word_count,
    source: row.source,
    license: row.license,
    attributionUrl: row.attribution_url,
    paragraphs: row.paragraphs,
    questions: row.questions
  };
}

async function dbGetByHash(hash) {
  if (!supabaseConfigured()) return null;
  const url = `${process.env.SUPABASE_URL}/rest/v1/${TABLE}?passage_hash=eq.${encodeURIComponent(hash)}&select=*`;
  const r = await fetch(url, { headers: sbHeaders() });
  if (!r.ok) return null;
  const rows = await r.json();
  return rows && rows[0] ? rows[0] : null;
}

async function dbList(limit = 100) {
  if (!supabaseConfigured()) return [];
  const url = `${process.env.SUPABASE_URL}/rest/v1/${TABLE}` +
    `?select=passage_hash,title,source,level,word_count,created_at&order=created_at.desc&limit=${limit}`;
  const r = await fetch(url, { headers: sbHeaders() });
  if (!r.ok) return [];
  const rows = await r.json();
  return (rows || []).map(row => ({
    hash: row.passage_hash,
    title: row.title,
    source: row.source,
    level: row.level,
    wordCount: row.word_count,
    createdAt: row.created_at
  }));
}

async function dbSave(hash, passage, questions) {
  if (!supabaseConfigured()) return;
  const url = `${process.env.SUPABASE_URL}/rest/v1/${TABLE}`;
  await fetch(url, {
    method: 'POST',
    headers: sbHeaders({
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal'
    }),
    body: JSON.stringify({
      passage_hash: hash,
      title: passage.title || null,
      subtitle: passage.subtitle || null,
      level: passage.level || null,
      stage: passage.stage || null,
      word_count: passage.wordCount || null,
      source: passage.source || null,
      license: passage.license || null,
      attribution_url: passage.attributionUrl || null,
      paragraphs: passage.paragraphs,
      questions,
      model: OPENAI_MODEL
    })
  }).catch(() => { /* best-effort */ });
}

// ---- OpenAI generation ----
function buildPrompt(paragraphs, types, count) {
  const passage = paragraphs.map(p => `[Paragraph ${p.marker}]\n${p.text}`).join('\n\n');
  return `You are an expert IELTS Reading question writer.

Write exactly ${count} questions for the passage below. Use ONLY these question types: ${types.join(', ')}.
Rules:
- "tfng": statement to judge as TRUE, FALSE, or NOT GIVEN. Use NOT GIVEN when the passage neither confirms nor contradicts. Be strict and fair.
- "mcq": one correct option out of exactly 4, labelled "A. ", "B. ", "C. ", "D. ". correctAnswer is the single letter.
- "text": sentence/note completion. correctAnswer is an array of acceptable short answers (words taken from the passage).
Every question MUST include:
- "keywordParagraph": the single paragraph letter (A, B, C, ...) that contains the answer.
- "explanation": one sentence citing the passage and why the answer is correct.
Number the "question" text starting at 1.

Return STRICT JSON only, shape:
{"questions":[{"type":"tfng","question":"1. ...","correctAnswer":"TRUE","keywordParagraph":"A","explanation":"..."},
{"type":"mcq","question":"2. ...","options":["A. ...","B. ...","C. ...","D. ..."],"correctAnswer":"B","keywordParagraph":"B","explanation":"..."},
{"type":"text","question":"3. ...","correctAnswer":["word"],"keywordParagraph":"C","explanation":"..."}]}

PASSAGE:
${passage}`;
}

async function generateWithOpenAI(paragraphs, types, count) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You output only valid JSON matching the requested schema.' },
        { role: 'user', content: buildPrompt(paragraphs, types, count) }
      ]
    })
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    throw new Error(`OpenAI ${r.status}: ${detail.slice(0, 200)}`);
  }
  const data = await r.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned no content');
  return JSON.parse(content);
}

function normalizeQuestions(raw) {
  const list = Array.isArray(raw?.questions) ? raw.questions : [];
  const valid = [];
  let id = 1;
  for (const q of list) {
    const type = String(q.type || '').toLowerCase();
    if (!['tfng', 'mcq', 'text'].includes(type)) continue;
    if (!q.question) continue;
    const out = {
      id,
      type,
      question: String(q.question),
      keywordParagraph: q.keywordParagraph ? String(q.keywordParagraph).trim().charAt(0).toUpperCase() : undefined,
      explanation: q.explanation ? String(q.explanation) : undefined
    };
    if (type === 'tfng') {
      const ca = String(q.correctAnswer || '').toUpperCase().trim();
      if (!['TRUE', 'FALSE', 'NOT GIVEN'].includes(ca)) continue;
      out.correctAnswer = ca;
    } else if (type === 'mcq') {
      if (!Array.isArray(q.options) || q.options.length < 2) continue;
      out.options = q.options.map(String);
      out.correctAnswer = String(q.correctAnswer || '').trim().charAt(0).toUpperCase();
    } else {
      out.correctAnswer = Array.isArray(q.correctAnswer) ? q.correctAnswer.map(String) : [String(q.correctAnswer || '')];
      if (!out.correctAnswer[0]) continue;
    }
    valid.push(out);
    id++;
  }
  return valid;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', resolveCorsOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ---- GET: list saved passages, or load one by hash ----
  if (req.method === 'GET') {
    const q = getQuery(req);
    try {
      if (q.hash) {
        const row = await dbGetByHash(String(q.hash));
        if (!row) return res.status(404).json({ ok: false, error: 'not-found' });
        return res.status(200).json({ ok: true, passage: rowToPassage(row) });
      }
      const items = await dbList();
      return res.status(200).json({ ok: true, items });
    } catch (err) {
      console.error('[generate-questions GET]', err);
      return res.status(200).json({ ok: false, items: [] });
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ---- POST: generate (or return cached) questions and save the full passage ----
  try {
    const body = req.body || {};
    const passage = body.passage || body; // accept a full passage object or loose fields
    const paragraphs = Array.isArray(passage.paragraphs) ? passage.paragraphs : [];
    const types = Array.isArray(body.types) && body.types.length ? body.types : ['tfng', 'mcq', 'text'];
    const count = 5; // Strict limit: exactly 5 AI questions

    if (paragraphs.length < 2) {
      return res.status(400).json({ error: 'passage.paragraphs required (min 2)' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({ ok: false, fallback: true, reason: 'no-openai-key' });
    }

    const hash = hashPassage(paragraphs, types);

    // 1) cache hit -> zero tokens (return full saved passage + questions)
    const existing = await dbGetByHash(hash);
    if (existing && Array.isArray(existing.questions) && existing.questions.length) {
      return res.status(200).json({ ok: true, cached: true, hash, questions: existing.questions.slice(0, 5) });
    }

    // 2) generate + save the full passage
    const raw = await generateWithOpenAI(paragraphs, types, count);
    const questions = normalizeQuestions(raw).slice(0, 5);
    if (questions.length < 1) {
      return res.status(200).json({ ok: false, fallback: true, reason: 'generation-too-few' });
    }

    await dbSave(hash, passage, questions);

    return res.status(200).json({ ok: true, cached: false, hash, questions });
  } catch (err) {
    console.error('[generate-questions POST]', err);
    return res.status(200).json({ ok: false, fallback: true, reason: 'error', detail: String(err.message || err) });
  }
}

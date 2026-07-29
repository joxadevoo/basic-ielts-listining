// ==========================================================================
// reading-source.js
// Fetch REAL, free, legally-reusable passages and build gap-fill questions
// WITHOUT any paid LLM/API.
//
// Current source: Simple / regular English Wikipedia (CC BY-SA 4.0).
//   - Wikipedia's MediaWiki API is CORS-enabled (origin=*), so we fetch it
//     directly from the browser — no backend, no key, no cost.
//   - Only "text" (sentence/note completion) questions are auto-generated,
//     because those are the only IELTS type that can be produced algorithmically
//     with acceptable quality. TFNG/MCQ/Matching must be authored by hand.
//
// Output shape matches READING_PASSAGES entries in app.js:
//   { id, title, subtitle, level, stage, wordCount, source, license,
//     attributionUrl, paragraphs:[{marker,text}], questions:[{...}] }
// ==========================================================================

const STOPWORDS = new Set([
  'the','a','an','and','or','but','of','to','in','on','at','for','with','as','by',
  'is','are','was','were','be','been','being','it','its','this','that','these','those',
  'from','into','than','then','they','them','their','there','here','which','who','whom',
  'whose','what','when','where','why','how','can','could','will','would','shall','should',
  'may','might','must','have','has','had','do','does','did','not','no','so','such','also',
  'more','most','some','any','each','other','many','much','one','two','three','about',
  'up','out','over','under','between','after','before','during','while','because','however'
]);

// Split a paragraph into sentences (good-enough heuristic).
function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Choose the best "gap" word from a sentence, or null if none is suitable.
// Preference: a number → a capitalised proper noun (not sentence-initial) → the
// longest content word. Returns { token, index } where index is the match offset.
function pickKeyword(sentence) {
  const tokenRe = /[A-Za-z0-9][A-Za-z0-9'’-]*/g;
  const tokens = [];
  let m;
  while ((m = tokenRe.exec(sentence)) !== null) {
    tokens.push({ token: m[0], index: m.index });
  }
  if (tokens.length < 6) return null; // too short to make a fair gap

  // 1) a pure number (e.g. 1990, 60)
  const num = tokens.find(t => /^\d[\d,.]*$/.test(t.token) && t.token.length >= 2);
  if (num) return num;

  // 2) a capitalised proper noun that is NOT the first token of the sentence
  const proper = tokens.slice(1).find(t =>
    /^[A-Z][a-z]{3,}$/.test(t.token) && !STOPWORDS.has(t.token.toLowerCase())
  );
  if (proper) return proper;

  // 3) the longest lowercase content word (>=6 chars, not a stopword)
  const content = tokens
    .filter(t => t.token.length >= 6 && !STOPWORDS.has(t.token.toLowerCase()) && /^[a-z]+$/i.test(t.token))
    .sort((a, b) => b.token.length - a.token.length)[0];
  return content || null;
}

// Extract readable paragraphs from a plain-text Wikipedia extract.
// Wikipedia puts section headings on their own short lines; real paragraphs are
// long. We keep prose lines (>= 20 words). If an article is formatted as one big
// block (few line breaks), we fall back to chunking sentences into paragraphs.
function extractParagraphs(extract) {
  const lines = extract
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  // Primary: lines that read like prose (headings are short).
  let paras = lines.filter(l => l.split(/\s+/).length >= 15);
  if (paras.length >= 1) return paras.slice(0, 6);

  // Fallback: join everything that isn't an obvious heading, then chunk sentences.
  const body = lines.filter(l => l.split(/\s+/).length >= 5).join(' ');
  const sentences = splitSentences(body);
  if (sentences.length < 2) return [];
  const chunks = [];
  for (let i = 0; i < sentences.length && chunks.length < 6; i += 3) {
    chunks.push(sentences.slice(i, i + 3).join(' '));
  }
  return chunks;
}

// Turn cleaned Wikipedia text into a passage + auto gap-fill questions.
function buildPassageFromText({ id, title, extract, sourceUrl, simple }) {
  const chosen = extractParagraphs(extract);
  if (chosen.length < 1) {
    throw new Error('Maqolada yetarli matn topilmadi. Boshqa mavzu sinab ko\'ring.');
  }

  const markers = ['A', 'B', 'C', 'D', 'E', 'F'];
  const paragraphs = chosen.map((text, i) => ({ marker: markers[i], text }));
  const wordCount = chosen.join(' ').split(/\s+/).length;

  // Generate gap-fill questions, spread across paragraphs.
  const questions = [];
  const usedAnswers = new Set();
  let qid = 1;

  outer:
  for (let pass = 0; pass < 2; pass++) {          // up to 2 gaps per paragraph
    for (const p of paragraphs) {
      if (questions.length >= 8) break outer;
      const sentences = splitSentences(p.text);
      const sentence = sentences[pass] || sentences[sentences.length - 1 - pass];
      if (!sentence) continue;

      const kw = pickKeyword(sentence);
      if (!kw) continue;
      const answerNorm = kw.token.toLowerCase();
      if (usedAnswers.has(answerNorm)) continue;
      usedAnswers.add(answerNorm);

      const blanked = sentence.slice(0, kw.index) + '__________' + sentence.slice(kw.index + kw.token.length);

      questions.push({
        id: qid,
        type: 'text',
        question: `${qid}. ${blanked}`,
        correctAnswer: [kw.token, answerNorm],
        keywordParagraph: p.marker,
        explanation: `The passage states: "${sentence}"`
      });
      qid++;
    }
  }

  if (questions.length < 1) {
    throw new Error('Ushbu maqoladan savol tuzib bo\'lmadi. Boshqa mavzu kiriting.');
  }

  return {
    id,
    title,
    subtitle: `Auto-generated sentence-completion practice from a real ${simple ? 'Simple English ' : ''}Wikipedia article.`,
    level: simple ? 'B1' : 'B2',
    stage: simple ? 1 : 2,
    wordCount,
    source: simple ? 'Simple Wikipedia' : 'Wikipedia',
    license: 'CC BY-SA 4.0',
    attributionUrl: sourceUrl,
    paragraphs,
    questions
  };
}

// Search Wikipedia for a matching article title if exact string lookup misses.
async function searchWikipediaTitle(host, query) {
  try {
    const url = `https://${host}/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const titles = data?.[1];
    return titles && titles[0] ? titles[0] : null;
  } catch (_) {
    return null;
  }
}

// Fetch the plain-text extract for a single title. Returns { title, extract, sourceUrl }.
async function fetchExtract(host, title) {
  const url = `https://${host}/w/api.php?action=query&prop=extracts|info&explaintext=1&` +
    `exsectionformat=plain&inprop=url&redirects=1&titles=${encodeURIComponent(title)}&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wikipedia request failed (${res.status}).`);
  const data = await res.json();
  const pages = data?.query?.pages;
  const page = pages && Object.values(pages)[0];
  if (!page || page.missing !== undefined || !page.extract) return null;
  return {
    title: page.title,
    extract: page.extract,
    sourceUrl: page.fullurl || `https://${host}/wiki/${encodeURIComponent(page.title)}`
  };
}

// Public: fetch a passage from Wikipedia. `topic` optional — omit for a random article.
export async function fetchWikipediaPassage(topic, { simple = true } = {}) {
  const primaryHost = simple ? 'simple.wikipedia.org' : 'en.wikipedia.org';
  const rawTitle = (topic || '').trim();

  // Specific topic requested:
  if (rawTitle) {
    // 1. Direct extract on primary host
    let ex = await fetchExtract(primaryHost, rawTitle);
    
    // 2. Search title on primary host if direct lookup missed
    if (!ex) {
      const searchTitle = await searchWikipediaTitle(primaryHost, rawTitle);
      if (searchTitle) ex = await fetchExtract(primaryHost, searchTitle);
    }
    
    // 3. Fallback to en.wikipedia.org if simple.wikipedia.org had no match
    if (!ex && simple) {
      ex = await fetchExtract('en.wikipedia.org', rawTitle);
      if (!ex) {
        const searchTitle = await searchWikipediaTitle('en.wikipedia.org', rawTitle);
        if (searchTitle) ex = await fetchExtract('en.wikipedia.org', searchTitle);
      }
    }

    if (!ex) {
      throw new Error(`"${rawTitle}" bo'yicha maqola topilmadi. Boshqa mavzu kiritib ko'ring (masalan: Photosynthesis, Football, Space).`);
    }

    return buildPassageFromText({ id: `wiki-${Date.now()}`, ...ex, simple });
  }

  // Random article flow
  const rr = await fetch(
    `https://${primaryHost}/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=8&format=json&origin=*`
  );
  const rj = await rr.json();
  const candidates = (rj?.query?.random || []).map(a => a.title);
  if (!candidates.length) throw new Error('Could not fetch a random article.');

  for (const cand of candidates) {
    const ex = await fetchExtract(primaryHost, cand);
    if (!ex) continue;
    try {
      return buildPassageFromText({ id: `wiki-${Date.now()}`, ...ex, simple });
    } catch (_) {
      // too short / not enough prose — try the next candidate
    }
  }
  throw new Error('Mos keladigan tasodifiy maqola topilmadi. Qayta urinib ko\'ring yoki mavzu kiriting.');
}

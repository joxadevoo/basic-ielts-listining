# IELTS Reading Module — Progress Log

> Running log of completed work. Newest entry on top. Read [`READING-MODULE-PLAN.md`](./READING-MODULE-PLAN.md)
> for the full plan; read this file to see how far the work has actually progressed.
>
> **Format per entry:** date · phase/task · what was done (files + lines) · how verified · what's next.

---

## Phase F1 — Foundation

_Status: ✅ COMPLETE. Done 2026-07-28._

Tasks (from plan §4):
- [x] F1.1 — Fix scoring bug in `submitReadingTest()`
- [x] F1.2 — Add `explanation` + `keywordParagraph` to existing passages
- [x] F1.3 — Review mode (per-question correct/incorrect + explanation + passage highlight)
- [x] F1.4 — Persistence to `localStorage`
- [x] F1.5 — Multiple accepted answers for text questions

---

<!-- New reports appended below this line as tasks complete -->

### 2026-07-28 · Task carousel polish (labels, mouse-drag, active style)

Per user feedback on the floating task carousel:
- **Labels → `Task <unit>.<n>`** (e.g. Task 3.1 … Task 3.9). `TRACK_SEGMENTS[1004]` gained `unit: 3`;
  tasks no longer carry `name` — `renderTrackTaskNav` builds the label as `Task ${seg.unit}.${idx+1}`
  (still honors an explicit `name` if present).
- **No bottom scrollbar on desktop** — `.ttn-track` scrollbar fully hidden (`scrollbar-width:none`,
  `::-webkit-scrollbar{display:none}`). New `enableTaskCarouselMouse()` adds **drag-to-scroll** (with
  a drag-vs-click guard so dragging doesn't seek) and **vertical-wheel → horizontal scroll**. Cursor
  `grab`/`grabbing`. Mobile keeps native touch-swipe.
- **Active task** now a bit bigger + **green border** (`2px var(--color-success)`, tinted bg, larger
  font/padding, green glow) instead of the solid primary fill.
- Bar stays transparent; pills keep their own translucent background (user: background on the pills, not the bar).

**Verified (DOM + screenshot):** labels Task 3.1–3.9; `scrollbar-width:none`; wheel scroll moves the
carousel; drag wired (`mouseWired`); active Task 3.5 → 2px green border, larger font. No console errors.

**Files touched:** `app.js`, `index.css`.

### 2026-07-28 · Task nav → floating carousel above the player

**Problem:** the task buttons were placed inside `.player-center-controls` and didn't fit — they
wrapped and overlapped the speed/volume controls.

**Fix:** moved `#track-task-nav` out of the center controls to be a direct child of
`.audio-player-footer`, and restyled it as a **floating single-row carousel above the player**:
`position:absolute; bottom:100%` (sits just above the 96px footer), full width, blurred player-bar
background. Buttons live in an inner `.ttn-track` with `overflow-x:auto; flex-wrap:nowrap` (thin
scrollbar) so all tasks stay on ONE row and scroll horizontally instead of wrapping.
`updateActiveTaskHighlight()` now `scrollIntoView`s the active task (centered, smooth) so the current
task stays visible as playback advances.

**Verified (DOM + screenshot):** Trek 04 → floating bar above player, `position:absolute`,
`bottom:95px`, 9 buttons on one scrollable row (`scrollWidth > clientWidth`); seeking to Task 7
highlights it and the carousel scrolls it into view. No console errors.

**Files touched:** `index.html`, `index.css`, `app.js`.

### 2026-07-28 · Listening — task jump buttons (seek-to-timestamp) for combined tracks

**Feature:** some Listening Strategies audios are combined files where one track holds several
tasks. When such a track plays, buttons **Task 1 / Task 2 / …** appear above the player progress bar;
clicking one seeks the audio to that task's start.

**Implementation (`app.js`):**
- `TRACK_SEGMENTS` — data map keyed by **track id** (from `tracks.js`) → `{ tasks:[{name,start,end}] }`,
  times in seconds. Easy to extend as the user supplies intervals for more tracks.
- `renderTrackTaskNav(track)` — called in `selectTrack()`; shows the buttons if the track has segments,
  hides otherwise.
- `window.seekTrackTask(startSec)` — sets `audio.currentTime` (waits for metadata if needed) and plays.
- `updateActiveTaskHighlight()` — called from `updatePlayerProgress()` (timeupdate); highlights the
  task whose `[start,end)` contains the current time.
- HTML: `#track-task-nav` container added above `.player-progress-row` (`index.html`). CSS `.track-task-nav`
  / `.ttn-btn` (`index.css`), theme-aware, wraps on small screens.

**Data added — Trek 04 (id 1004):** 9 tasks from the user's intervals
(Task 1 13:16–14:45 … Task 9 26:16–28:53). Task 10 had no interval, so it's omitted.

**Important correction during build:** first mapped to id 1005 (Trek 05) by inference, but the browser
revealed **Trek 04's real audio duration is 1735 s (28:55)** — matching the last interval (28:53) —
while Trek 05 is only 26:52 (too short). Remapped to **id 1004**. The tasks start at 13:16 because the
first ~13 min of that combined track is the preceding (Unit 2) material.

**Verified (DOM + screenshot):** Trek 04 → 9 task buttons; clicking Task 5 → `currentTime=1223`, Task 5
highlighted; Task 9 → `currentTime=1576` (within the 1735 s track); Trek 05 → no task nav. No console errors.

**To add more tracks later:** user provides intervals per track → add a `TRACK_SEGMENTS[<trackId>]` entry.

**Files touched:** `app.js`, `index.html`, `index.css`.

### 2026-07-28 · Result screen + review polish

**Result banner (`submitReadingTest` + new `buildReadingResultBanner()` in `app.js`):** now built
dynamically instead of the 3 static fields. Shows: band badge, a score-keyed encouraging title +
message (Uzbek, `readingResultTone`), chips (`✓ N to'g'ri`, `✗ M xato`, `%·correct/total`), a
best-score / **🏆 Yangi rekord!** chip (from stored `bestPct`), and a **per-question-type breakdown**
with mini progress bars (`readingTypeLabel` → True/False/NG, MCQ, Gap-fill, …). This delivers the
"error analysis by question type" pillar from the plan.

**Review cards (`renderReadingQuestions`):** each reviewed question now shows **the user's own answer**
(`Sizning javobingiz:` — green if right, red strike-through if wrong, italic "javob berilmagan" if blank)
above the correct answer, plus `💡` on the explanation and `📍 Javob manbasi: Paragraph X`.

**CSS (`index.css`):** added styles for `.result-chips/.rchip*`, `.result-typebreak/.tb-*` (bars),
and `.q-review-your/.rv-*`. Responsive (`tb-item` grid collapses under 520px), theme-aware.

**Verified (screenshot + DOM):** loaded a saved passage, mixed answers, submitted → banner shows
Band, tone, chips (2 correct / 6 wrong / 25%), and type breakdown (TF/NG 1/3, MCQ 1/3, Gap-fill 0/2);
review card shows "Sizning javobingiz: …" + correct answer + 💡 explanation + 📍 source. No console errors.

**Files touched:** `app.js`, `index.css`.

### 2026-07-28 · Supabase LIVE — full save + cache + saved-selection verified end-to-end

**Setup completed by user:** added the real `service_role` key to `.env` and ran `supabase/schema.sql`.

**Diagnosis that unblocked it:** a temporary `GET ?diag=1` mode revealed the real error — the key was
valid, but the query returned `404 PGRST205: Could not find the table 'public.reading_passages'`
(the user had first run the older `reading_cache` schema). After running `supabase/schema.sql`
(creates `reading_passages`), everything worked. The diagnostic mode has been **removed**.

**Verified end-to-end (dev, no console errors):**
- Table reachable (`select` 200).
- POST generate+save → `ok, 8 questions`; **repeat identical POST → `cached:true` (0 tokens)** ✅
- `GET` list → the saved passage appears; `GET ?hash=` → full passage returns with **2 paragraphs + 8 questions** ✅
- **UI round-trip:** Reading pane shows a **💾 Saqlangan (bazadan)** optgroup; selecting the saved
  passage loads it from the DB — title, paragraph text, and the mixed `tfng/mcq/text` questions — with 0 tokens.

**Status: F5 (real content + OpenAI + Supabase cache/save + saved-selection) is COMPLETE and live in dev.**

**Before production:** add `OPENAI_API_KEY`, `OPENAI_MODEL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
to **Vercel** env vars (they currently live only in local `.env`).

**Optional next phase:** Auth (Supabase Auth + per-user progress sync) — independent of everything above.

### 2026-07-28 · Save FULL passage + questions to DB, and make saved ones selectable

**User request:** passage text AND questions should both be saved to the DB, and saved passages
should be re-selectable from the selector (loaded from DB, no tokens).

**What changed:**

1. **Schema** — replaced `supabase/reading_cache.sql` with **`supabase/schema.sql`**. New table
   **`reading_passages`** stores the FULL passage: `paragraphs` (jsonb), `questions` (jsonb), plus
   `title/subtitle/level/stage/word_count/source/license/attribution_url/model/created_at`, keyed by
   `passage_hash`. Index on `created_at desc` for the listing. RLS on, no policies.

2. **`api/generate-questions.js`** — now one endpoint, three jobs:
   - `POST` — accepts a **full passage object**, generates questions (or cache hit), and
     **saves the whole passage + questions** via `dbSave()` (all columns). Returns `{ok, cached, hash, questions}`.
   - `GET ?list=1` (or no params) — `dbList()` returns saved passages (hash, title, source, level, createdAt), newest first.
   - `GET ?hash=<h>` — `dbGetByHash()` → `rowToPassage()` returns the full passage (paragraphs + questions), id `db:<hash>`.
   - Query parsing works in both dev and Vercel (`getQuery`).

3. **Client (`app.js`)**:
   - `generateAiQuestions()` now POSTs the **full `passage`** (so paragraphs + metadata are saved),
     stores the returned `hash`, and calls `fetchSavedPassages()` to refresh the list.
   - `fetchSavedPassages()` — GET list → builds a **`💾 Saqlangan (bazadan)` optgroup** in the selector.
   - `loadSavedPassage(hash)` — GET `?hash=` → registers the passage (`db:<hash>` id) and renders it (0 tokens).
   - Selector `change` handler: a `db:` option not yet in memory → `loadSavedPassage()`; otherwise render.
   - `fetchSavedPassages()` also runs when switching to the Reading skill.

**Verified in browser (dev):**
- `GET` list → `{ok:true, items:[]}`; selector handles an empty saved list (no optgroup, no crash).
- Full round-trip POST→list→get: **generation succeeds (8 questions), but the row does NOT persist**
  (`listCount:0`, `byHash ok:false`). Diagnosis: **Supabase `SUPABASE_SERVICE_KEY` is still the
  placeholder**, so `dbSave`/`dbGet` get 401 and fail silently (by design). OpenAI works (real key present).
- No console errors.

**⚠️ To make saving + saved-selection actually work, user must (unchanged from prior entry):**
1. Run **`supabase/schema.sql`** in the Supabase SQL Editor (creates `reading_passages`).
2. Put the real **service_role** key into `.env` `SUPABASE_SERVICE_KEY` (currently placeholder) — and Vercel env.
   After that: clicking **✨ AI savollar** saves the full passage+questions; it then appears under
   **💾 Saqlangan** in the selector and re-loads from the DB with 0 tokens. A repeated identical passage returns `cached:true`.

**Files touched:** `api/generate-questions.js`, `app.js`, `supabase/schema.sql` (new; old `reading_cache.sql` removed).

### 2026-07-28 · F5.2/F5.3 — OpenAI question generation + Supabase cache (built)

**What was built:**

1. **`api/generate-questions.js`** (Vercel serverless). POST `{title, source, paragraphs[], types[]}`.
   Flow: hash the passage → look up **Supabase `reading_cache`** → hit returns cached questions
   (0 tokens) → miss calls **OpenAI** (`gpt-4o-mini`, JSON mode), normalizes to our question shape
   (`tfng`/`mcq`/`text` with `correctAnswer`, `explanation`, `keywordParagraph`), stores in Supabase,
   returns. Uses plain `fetch` for both OpenAI and Supabase PostgREST — **no new npm deps**.
   Graceful degradation: no `OPENAI_API_KEY` → `{fallback:true}`; no Supabase creds → generates
   without caching; any error → `{fallback:true}` so the client keeps free gap-fill.

2. **`vite-api-plugin.js`** — registered `/api/generate-questions` and added `ALWAYS_REAL_ROUTES`
   so it runs the real handler in local dev instead of the Telegram stub.

3. **Client** (`app.js`, `index.html`, `index.css`): added **"✨ AI savollar"** button in the reading
   source bar (enabled once a passage is loaded). `generateAiQuestions()` POSTs the passage, swaps in
   the AI questions on `ok`, resets test/review state, re-renders. Toast distinguishes fresh vs cached
   (`0 token`). Any failure → toast + keeps the free questions.

4. **Env + schema:** `.env` / `.env.example` gained `OPENAI_API_KEY`, `OPENAI_MODEL` (`gpt-4o-mini`),
   `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (all server-only). SQL in **`supabase/reading_cache.sql`**
   (table + RLS enabled, no policies — only the service_role key writes).

**Verified in browser (dev):**
- Endpoint returns valid, passage-grounded IELTS questions (TFNG/MCQ/text) — OpenAI key is live.
- UI: gap-fill (8×`text`) → after AI click → mixed `tfng/mcq/text`. Grading + review panels work on
  AI questions. No console errors.
- **Cache probe: `cached:false` on a repeated identical payload → caching NOT active yet** (expected).

**⚠️ Remaining user setup to activate the token-saving cache:**
1. Run `supabase/reading_cache.sql` in the Supabase SQL Editor (creates `reading_cache`).
2. Put the real **service_role** key in `.env` `SUPABASE_SERVICE_KEY` (currently a placeholder) and in
   Vercel env. (`SUPABASE_URL` already set to the user's project.)
3. Add `OPENAI_API_KEY` + `SUPABASE_*` to **Vercel** env vars for production.
   After this, an identical passage returns `cached:true` (0 tokens).

**Next (optional, later):** Auth phase (Supabase Auth + user progress sync) — independent of this.

### 2026-07-28 · Fixes + removed mock passages

**Bug fix — "Article does not contain enough readable prose":** `reading-source.js`
paragraph extraction was too strict (required each line ≥140 chars ending in punctuation).
Rewrote as `extractParagraphs()`: keep prose lines (≥20 words); if an article is one big block,
fall back to chunking sentences into 3-sentence paragraphs. Random loader now pulls a batch
(`rnlimit=8`) and tries candidates until one has enough prose (skips stubs). Verified: random
(Herbert Pankau, Palak) and topic (Volcano) all load.

**Removed the 3 mock/sample passages (user request).** `READING_PASSAGES` is now `{}` (real
passages are loaded from Wikipedia at runtime). `index.html` selector reduced to a disabled
placeholder option. Added an **empty state** in the reading pane (`renderReadingPassage` when no
passage) + CSS `.reading-empty-state`. Guarded `renderReadingQuestions`, `submitReadingTest`
(now toasts "Avval passage yuklang"), and the `switchSkill('reading')` branch against a null
passage. Default `readingState.activePassageId` is now `null`.
Verified: empty state shows on open, Submit-while-empty doesn't throw, loading "Volcano"
replaces the empty state with 8 questions. No console errors.

**Files touched:** `reading-source.js`, `app.js`, `index.html`, `index.css`.

**Still next (unchanged):** OpenAI question layer + persistent cache. Architecture decided with
user: **Vercel + Supabase** (not a migration — Supabase added as the data layer). Vercel Blob quota
is exhausted, so the **question cache goes to Supabase Postgres** (`reading_cache` table keyed by
passage hash), written from a serverless `api/generate-questions.js` (OpenAI key server-side).
**Auth is deliberately deferred** to a separate later phase — the cache does not need it. User has
an OpenAI key. Waiting on: user to create a Supabase project + confirm go-ahead, then build the
SQL schema + endpoint.

### 2026-07-28 · F5-lite (free path) — Real passages from Wikipedia + gap-fill questions

**Decision context (important for whoever continues):**
- There is **NO official/legal IELTS content API**. Real Cambridge/BC tests are copyrighted.
- Chosen strategy: fetch **authentic, freely-reusable passages** from public sources, then
  create questions ourselves.
- **Cost constraint from the user:** Claude API is "too expensive" — do NOT use it. The user then
  clarified: use **OpenAI** for question generation, **but cache every generated question set to a
  database** so tokens are spent at most once per passage. (OpenAI layer NOT built yet — see "What's next".)
- Therefore the pipeline is **two layers**:
  1. **Free algorithmic layer (DONE this entry):** Wikipedia text + client-side gap-fill generation. Zero cost, no key, no backend.
  2. **OpenAI layer (TODO):** server-side generation of TFNG/MCQ/Matching, results cached persistently.

**What was done (free layer):**

1. **New module `reading-source.js`** — fetches a passage from **Simple English Wikipedia**
   (CC BY-SA 4.0) via the MediaWiki API. Wikipedia sends `Access-Control-Allow-Origin: *`
   (verified with curl), so the fetch runs **directly in the browser** — no serverless proxy,
   no API key, no cost.
   - `fetchWikipediaPassage(topic, {simple})` — topic search or random article (`list=random`).
   - `buildPassageFromText()` — cleans the plain-text extract, keeps 5 substantial paragraphs
     (markers A–E), and auto-generates up to 8 **gap-fill (`type:'text'`) questions**.
   - `pickKeyword()` — chooses the blanked word: number → capitalised proper noun → longest
     content word (stopword list applied). Answer stored as `[original, lowercased]`; our
     `normalizeReadingAnswer` handles the rest.
   - Each generated question carries `explanation` (the original full sentence) and
     `keywordParagraph` (for review highlighting) — same shape as hand-authored passages.
   - Passage objects now also carry `license` + `attributionUrl` (CC BY-SA attribution).

2. **Why only gap-fill is auto-generated:** sentence/note completion is the only IELTS type that
   can be produced algorithmically at acceptable quality. TFNG ("Not Given" especially), MCQ, and
   Matching need semantic reasoning → those come from the OpenAI layer or hand-authoring.

3. **UI** (`index.html` reading passage header): a `.reading-source-bar` with a topic input,
   **"Yuklash"** button, and a **🎲 random** button. CSS added in `index.css`.

4. **Wiring** (`app.js`):
   - `import { fetchWikipediaPassage } from './reading-source.js'`.
   - `loadRealPassage(topic)` — fetches, registers the passage into `READING_PASSAGES`, appends a
     `🌐 …` option to the selector, resets test/review state, renders. Busy state on buttons,
     error → toast (`warning`).
   - Buttons + Enter-key wired in the init block next to the other reading controls.

**How it was verified** (dev server, browser pane, no console errors):
- Loaded topic **"Photosynthesis"** → title `Photosynthesis`, meta `B1 · Simple Wikipedia · 226 words`,
  5 paragraphs, 6 gap-fill questions.
- Q1 rendered `"__________ is a process in which green plants make their own food…"`.
- Typed `photosynthesis` → **marked correct**; review panel showed the source sentence as the
  explanation and `📍 Paragraph A`; all 5 answer paragraphs highlighted.
- Result persisted to `localStorage.ielts_reading_progress` under the new `wiki-…` id.

**Files touched:** `reading-source.js` (new), `app.js`, `index.html`, `index.css`.

**What's next → OpenAI question layer (with persistent cache).** Design agreed with the user:
- **Serverless endpoint** `api/generate-questions.js` (Vercel function). The **OpenAI key must stay
  server-side** — never a `VITE_` var. Add `OPENAI_API_KEY` to `.env` / Vercel env. Suggest a cheap
  model (e.g. `gpt-4o-mini`).
- Endpoint input: passage text + requested question types. Output: questions in our data shape
  (TFNG/MCQ/etc. with `correctAnswer`, `explanation`, `keywordParagraph`).
- **Cache (the token-saver):** before calling OpenAI, hash the passage text (e.g. SHA-256) and look
  up a cached result. Store generated sets in **Vercel Blob** (already configured —
  `BLOB_READ_WRITE_TOKEN`) keyed by that hash → generated **once ever, shared across all users**.
  Optionally mirror to `localStorage` as a per-device fast cache.
- **Dev-plugin note:** `vite-api-plugin.js` currently returns a *stub* for every route when Telegram
  env is absent (the `hasTelegramConfig` gate, ~line 103). The new route must be registered in
  `API_ROUTES` **and** exempted from that gate so it runs the real handler locally.
- **Graceful fallback:** if no `OPENAI_API_KEY` is present, keep serving the free gap-fill questions
  so the feature never hard-fails.
- **Blockers to confirm with user before building:** (1) is an OpenAI API key available? (2) confirm
  Vercel Blob as the cache store; (3) confirm model choice (cost).

### 2026-07-28 · F1 (all tasks) — Foundation complete

**What was done**

1. **Data model enriched** (`app.js`, `READING_PASSAGES` ~line 483).
   - Every passage gained `level`, `stage`, `wordCount`, `source`.
   - Every question gained `explanation` (why the answer is right) and `keywordParagraph`
     (which paragraph holds the answer — used for review highlighting).
   - Text questions' `correctAnswer` changed from a single string to an **array of accepted
     variants** (e.g. `["60%", "60 percent", "sixty percent", "60"]`). F1.5.

2. **Scoring rewritten** (`app.js`). New helpers:
   - `normalizeReadingAnswer()` — trim, lowercase, strip punctuation, collapse spaces.
   - `isReadingAnswerCorrect(q, val)` — per-type grading. Fixed-choice types (tfng/ynng/mcq)
     use **exact** case-insensitive match; text types compare normalized value against the
     accepted-variants array. **This fixes the old bug** where `correctVal.includes(userVal)`
     gave false positives (e.g. `"RU"` matched `"TRUE"`). F1.1.
   - `escapeReadingHtml()` — user input is now HTML-escaped before being echoed into markup
     (prevents broken rendering / injection from typed answers).

3. **Review mode added** (`app.js` `renderReadingQuestions`, `submitReadingTest`, `resetReadingTest`).
   - New state: `readingState.isReviewMode`, `readingState.results`, `readingState.progress`.
   - After Submit: each card gets `q-correct` / `q-incorrect` styling, a verdict panel showing
     ✓/✗, the correct answer (if wrong), the explanation, and the source paragraph. Inputs are
     disabled. The passage pane highlights the paragraphs that held answers
     (`readingHighlightMarkers` + `.paragraph-highlight`). F1.3.
   - Submitting also stops the timer if running.

4. **Persistence added** (`app.js`). `saveReadingProgress()` writes to `localStorage`
   key `ielts_reading_progress` — per-passage `bestPct`, `lastPct`, `lastCorrect/Total`,
   `lastAnswers`, `attempts`, `updatedAt`. `loadReadingProgress()` is called from the init
   load block (next to the audiobook-progress load, ~line 1885). F1.4.

5. **CSS added** (`index.css`, after `.score-details p`): `.passage-meta-line`,
   `.paragraph-highlight`, `.reading-question-card.q-correct/.q-incorrect`, `.q-review-panel`
   and children. Uses existing theme variables (`--color-success`, `--color-danger`, etc.),
   works in both light/dark themes.

**How it was verified** (Vite dev server `ielts-dev`, port 3000, browser pane):
- Reading pane renders; meta line shows `B1 · Sample · 230 words`; 9 questions render.
- Filled a mixed answer set and submitted → banner `3 / 9 (33%)`, Band 5.0.
- Q1 (TRUE=correct) → green; Q2 (wrong) → red; unanswered → red; Q6 (mcq B) → green.
- **Bug-fix confirmed:** Q9 typed `"ru"` → correctly marked incorrect (old code could false-match).
- **Variants confirmed:** Q8 typed `"Machine Learning"` → correct via array + normalize.
- Inputs disabled in review; answer paragraphs highlighted.
- `localStorage.ielts_reading_progress` populated with bestPct/attempts/lastAnswers.
- Reset clears banner, highlights, review panels, re-enables inputs.
- No console errors throughout.

**Files touched:** `app.js`, `index.css`.

**What's next → Phase F2 (Question types).** See plan §3 & §4.
- Add renderers + scoring for the ~9 missing IELTS question types. Suggested order (easiest first):
  `ynng` is already wired (shares tfng renderer) — verify it; then `short-answer` (shares text
  logic), `table-fill`, `summary-bank`, then the matching family
  (`matching-headings`, `matching-info`, `matching-features`, `list-select`), then `diagram-label`.
- Each new type = one `else if` branch in `renderReadingQuestions()` + a matching case in
  `isReadingAnswerCorrect()` if grading differs from existing text/fixed-choice logic.
- Add one small demo passage per new type so it can be visually verified.
- **Note:** `ynng` (Yes/No/Not Given) renderer was already added in F1 alongside `tfng` — F2 just
  needs a passage that uses it plus a quick check.

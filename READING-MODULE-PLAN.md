# IELTS Reading Module — Build Plan (Master Document)

> **Purpose of this file:** This is the single source of truth for building the Reading skill
> in this app. It is written so that *any AI or developer* picking up this work later can
> understand the full vision, the current architecture, and exactly what to do next.
>
> **Companion file:** [`READING-PROGRESS.md`](./READING-PROGRESS.md) — a running log where every
> completed task is reported (what was done + what remains). **Always read that file first**
> to know where the work currently stands, then continue from the next unchecked item here.

---

## 0. Context: How this app is built (read before touching code)

- **Stack:** Vanilla JS + Vite. No framework. Single `app.js` (~138 KB), single `index.html`, single `index.css`.
- **Entry points:** `index.html` (main app) + `stats.html` (public statistics page). Both configured in `vite.config.js`.
- **State:** one global `state` object in `app.js` (starts ~line 440). No reactive framework — the UI is updated by imperative `render*()` functions that write `innerHTML`.
- **Persistence:** `localStorage` only. Keys are prefixed `ielts_*`. See `saveProgress()` (~line 1731) and the load block (~line 1650) for the Listening pattern to mirror.
- **Skills framework:** The app has a 4-skill shell — `listening`, `reading`, `writing`, `speaking`.
  - `switchSkill(skill)` (~line 747) toggles `.skill-workspace-pane` panes.
  - Writing & Speaking are "Coming Soon" placeholders.
  - **Listening** is the complete, mature module — use it as the reference implementation for quality.
  - **Reading** is a working *prototype* — the subject of this plan.
- **Media:** audio/PDF served from Vercel Blob / R2 via `MEDIA_BASE_URL` (`getMediaUrl()`, ~line 855). Not relevant to Reading yet.

### Current Reading code map (as of plan creation)

| Thing | Location in `app.js` |
|---|---|
| `state.readingState` init | ~line 458 |
| `READING_PASSAGES` data (3 sample passages) | ~line 483 |
| `renderReadingPassage(id)` | ~line 586 |
| `renderReadingQuestions(id)` | ~line 611 |
| `handleReadingAnswerChange(qid, val)` | ~line 661 |
| `submitReadingTest()` | ~line 665 |
| `resetReadingTest()` | ~line 705 |
| `toggleReadingTimer()` / `updateReadingTimerDisplay()` | ~line 717 / 739 |
| `switchSkill('reading')` hook | ~line 792 |
| Reading HTML pane | `index.html` ~line 725 (`#skill-workspace-reading`) |

---

## 1. The pedagogical vision (the "why")

The learner progresses through **3 stages**, and the app must support each with a distinct mode:

| Stage | CEFR | App mode | Focus |
|---|---|---|---|
| 🟢 1 — Base | A2→B1 | **Practice mode** | Short texts, no timer, tap-word dictionary (AWL). Kill the fear. |
| 🟡 2 — Strategy | B1→B2 | **Strategy mode** | Skimming timer, scanning highlight, per-question "which sentence held the answer". |
| 🔴 3 — Real IELTS | B2→C1 (Band 7+) | **Exam mode** | Full 60 min, 40 questions, review only at the end. Cambridge format. |

**Three pillars that the prototype is missing and this plan adds:**
1. **Measurement** — band tracking over time + an error journal ("which question types do I fail?").
2. **Timing** — skimming/scanning timers introduced early (Stage 2), not only in the final exam.
3. **Error analysis** — a mandatory review step after every test: right/wrong, *why*, and the sentence that held the answer.

---

## 2. Data model (target shape)

Extend each passage and question in `READING_PASSAGES`:

```js
"passage-1": {
  id, title, subtitle,
  level: "B1",              // A2 | B1 | B2 | C1  (drives Stage filtering)
  stage: 2,                 // 1 | 2 | 3
  wordCount: 720,           // for skimming-speed measurement
  source: "Collins",        // provenance label
  paragraphs: [ { marker: "A", text: "..." } ],
  questions: [{
    id, type,               // one of the 14 types below
    question, options, correctAnswer,
    explanation: "...",     // NEW — shown in review mode (why this answer)
    keywordParagraph: "B"   // NEW — which paragraph/sentence holds the answer (scanning training + highlight)
  }]
}
```

## 3. The 14 IELTS question types

Implemented as `else if (q.type === ...)` branches in `renderReadingQuestions()` + matching scoring logic in `submitReadingTest()`.

| Type | code | Status | Target stage |
|---|---|---|---|
| Sentence/Note Completion | `text` | ✅ exists | 1 |
| Short Answer | `short-answer` | ⬜ | 1 |
| True/False/Not Given | `tfng` | ✅ exists | 2 |
| Yes/No/Not Given | `ynng` | ⬜ | 2 |
| Multiple Choice | `mcq` | ✅ exists | 2 |
| Table/Flowchart Completion | `table-fill` | ⬜ | 2 |
| Matching Headings | `matching-headings` | ⬜ | 3 |
| Matching Information | `matching-info` | ⬜ | 3 |
| Matching Features | `matching-features` | ⬜ | 3 |
| Summary Completion (word bank) | `summary-bank` | ⬜ | 3 |
| Diagram Labelling | `diagram-label` | ⬜ | 3 |
| List Selection | `list-select` | ⬜ | 3 |

---

## 4. Build roadmap (phases)

> Work top-to-bottom. Do not start a phase until the previous one is reported complete in `READING-PROGRESS.md`.

### ▶ Phase F1 — Foundation ✅ COMPLETE (2026-07-28)
Make the existing prototype *correct and trustworthy* before adding features.
- [x] **F1.1** Fix the scoring bug in `submitReadingTest()`. Current `correctVal.includes(userVal)` gives false positives (e.g. "RU" matches "TRUE"). Replace with proper per-type comparison + normalized text matching (trim, lowercase, accept answer-variants array).
- [x] **F1.2** Add `explanation` + `keywordParagraph` fields to the 3 existing passages' questions.
- [x] **F1.3** Add **review mode**: after Submit, each question card shows correct/incorrect state, the correct answer, and its explanation; the source paragraph is highlighted in the passage pane.
- [x] **F1.4** Add **persistence**: save reading results + last answers to `localStorage` (`ielts_reading_progress`), load on init. Mirror the Listening `saveProgress`/load pattern.
- [x] **F1.5** Support **multiple accepted answers** for text questions (`correctAnswer` may be an array).

### ▶ Phase F2 — Question types
- [ ] Add the ~9 missing question-type renderers + scoring (see table in §3).
- [ ] Add a small demo passage exercising each new type.

### ▶ Phase F3 — Stage system
- [ ] Level/stage chips above the passage selector.
- [ ] Three modes (Practice / Strategy / Exam) toggling timer + review behavior.
- [ ] Skimming timer + scanning highlight for Stage 2.
- [ ] Tap-word AWL dictionary for Stage 1.

### ▶ Phase F4 — Measurement
- [ ] Persist every test result with timestamp.
- [ ] Error journal grouped by question type.
- [ ] Band-over-time chart in `stats.html` next to Listening stats.

### ▶ Phase F5 — Real content (STARTED — free layer done)
Two-layer pipeline. **No Cambridge/BC API exists** (copyright); we fetch free reusable text and make our own questions.
- [x] **F5.1 (free layer)** Fetch real passages from **Simple English Wikipedia** (CC BY-SA, CORS-enabled, browser-side, zero cost) and auto-generate **gap-fill** questions. Module: `reading-source.js`. UI loader in the reading pane. ✅ verified.
- [x] **F5.2 (OpenAI layer)** Server-side `api/generate-questions.js` calls **OpenAI** (`gpt-4o-mini`, JSON mode) to generate TFNG/MCQ/text. Key is server-side only. ✅ verified returning valid questions.
- [x] **F5.3 (persistent cache — the token-saver)** Hash each passage; cache generated sets in **Supabase Postgres** (`reading_cache`, keyed by hash) — Vercel Blob quota was exhausted, so Supabase replaced it. Fallback to free gap-fill on any failure. Code done; **cache activates once the user runs the SQL + adds the real service_role key** (see progress log).
- [x] **F5.4** Registered the route in `vite-api-plugin.js` and exempted it from the `hasTelegramConfig` stub gate (`ALWAYS_REAL_ROUTES`).
- **Auth:** deliberately deferred to a separate later phase — the cache does not need it.

---

## 5. Conventions for whoever continues this work

- **Match the surrounding code style** — this is a no-framework, `innerHTML`-driven app. Do not introduce a framework or a build-step change.
- **After finishing ANY task**, append a dated entry to `READING-PROGRESS.md`: what changed, which files/lines, how it was verified, and what the next task is.
- **Verify in the browser** via the Vite dev server (`ielts-dev` launch config, port 3000) before reporting done.
- **Keep `state.readingState` the single source of truth** for reading; never read answers straight from the DOM for scoring.
- Update the checkboxes in §4 of *this* file as phases complete.

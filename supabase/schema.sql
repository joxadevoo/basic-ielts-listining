-- ==========================================================================
-- Supabase schema for saved Reading passages + their generated questions.
-- Run once: Supabase dashboard → SQL Editor → New query → Run.
--
-- Stores the FULL passage (paragraphs + metadata) together with its generated
-- questions, keyed by a hash of the passage. This means:
--   1. Each unique passage costs OpenAI tokens at most once (shared cache).
--   2. Saved passages can be listed and re-loaded from the selector later
--      (passage + questions come straight from the DB, no tokens).
-- ==========================================================================

create table if not exists public.reading_passages (
  passage_hash    text primary key,
  title           text,
  subtitle        text,
  level           text,
  stage           int,
  word_count      int,
  source          text,
  license         text,
  attribution_url text,
  paragraphs      jsonb not null,   -- [{ marker, text }]
  questions       jsonb not null,   -- [{ id, type, question, options?, correctAnswer, explanation, keywordParagraph }]
  model           text,
  created_at      timestamptz not null default now()
);

-- Newest-first listing for the selector.
create index if not exists reading_passages_created_at_idx
  on public.reading_passages (created_at desc);

-- The API writes/reads with the service_role key, which bypasses RLS.
-- Enable RLS with NO policies so the public anon/publishable key cannot touch
-- this table directly from the browser.
alter table public.reading_passages enable row level security;

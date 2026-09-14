-- ============================================================
--  Redline Supplements — Athletes: add title/tagline column
--  Paste this whole file into Supabase -> SQL Editor -> Run
-- ============================================================

-- title = short professional tagline shown under the athlete's name
-- (e.g. "Professional MMA Fighter")

alter table athletes add column if not exists title text;

update athletes
set title = 'Professional MMA Fighter'
where name = 'Daniel Smith';

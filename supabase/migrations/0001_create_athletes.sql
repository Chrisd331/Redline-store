-- ============================================================
--  Redline Supplements — Athletes table
--  Paste this whole file into Supabase -> SQL Editor -> Run
-- ============================================================

-- ---------- Table ----------
-- gym = the athlete's training camp (e.g. "XFC Bayswater (Victoria)")
-- promotion = the organisation they compete under (e.g. "UFC", "PFL") — different thing

create table if not exists athletes (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  record         text,
  gym            text,
  promotion      text,
  weight_class   text,
  quote          text,
  image_url      text,
  instagram_url  text,
  sort_order     integer not null default 0,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---------- Row Level Security ----------
-- Same pattern as products: anyone can READ active rows, nobody (anon/logged-in)
-- can write. The server uses the service-role key, which bypasses RLS, for any
-- future admin writes.

alter table athletes enable row level security;

drop policy if exists "public read active athletes" on athletes;
create policy "public read active athletes"
  on athletes for select
  using (active = true);

-- No insert/update/delete policies => denied for public roles by default.

-- ---------- Seed: Daniel Smith ----------

insert into athletes (name, record, gym, promotion, weight_class, quote, image_url, instagram_url, sort_order, active)
values (
  'Daniel Smith',
  '6-1',
  'XFC Bayswater (Victoria)',
  null,
  null,
  null,
  null,
  null,
  1,
  true
);

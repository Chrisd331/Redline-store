-- ============================================================
--  Redline Supplements — Supabase schema
--  Paste this whole file into Supabase -> SQL Editor -> Run
-- ============================================================

-- ---------- Tables ----------

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency    text not null default 'aud',
  image_url   text,
  stock       integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  email             text,
  total_cents       integer not null default 0,
  currency          text not null default 'aud',
  status            text not null default 'pending',
  stripe_session_id text unique,
  created_at        timestamptz not null default now()
);

create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references orders(id) on delete cascade,
  product_id  uuid references products(id),
  name        text not null,
  price_cents integer not null,
  quantity    integer not null check (quantity > 0)
);

-- ---------- Row Level Security ----------
-- Anyone can READ active products. Nobody (anon/logged-in) can touch orders.
-- The server uses the service-role key, which bypasses RLS for writing orders.

alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

drop policy if exists "public read active products" on products;
create policy "public read active products"
  on products for select
  using (active = true);

-- No policies on orders / order_items => denied for public roles by default.

-- ---------- Seed: standard retail supplements ----------

insert into products (slug, name, description, price_cents, currency, stock) values
  ('creatine-mono-500g', 'Creatine Monohydrate', 'Pure micronised creatine monohydrate. 60 serves.', 4995, 'aud', 100),
  ('whey-isolate-1kg',   'Whey Protein Isolate 1kg',  'Low-carb, fast-absorbing whey isolate. 33 serves.', 6995, 'aud', 60),
  ('pre-workout-300g',   'Pre-Workout 300g',          'Caffeine, beta-alanine and citrulline blend. 30 serves.', 5495, 'aud', 80),
  ('electrolytes-200g',  'Electrolytes 200g',         'Sodium, potassium and magnesium hydration mix.', 3495, 'aud', 120),
  ('bcaa-250g',          'BCAA 250g',                 '2:1:1 branched-chain amino acids. 25 serves.', 3995, 'aud', 50),
  ('shaker-700ml',       'Redline Shaker 700ml',      'BPA-free shaker with stainless mixing ball.', 1495, 'aud', 200)
on conflict (slug) do nothing;

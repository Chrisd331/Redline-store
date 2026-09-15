-- ============================================================
--  Redline Supplements — Products: add spec/directions/ingredients fields
--  Paste this whole file into Supabase -> SQL Editor -> Run
-- ============================================================

-- Structured fields so the product detail page can show a real spec block
-- (net weight, serving size, serves per container) plus directions and
-- ingredients, instead of hardcoding them in the page. Nullable so existing
-- rows/products without this data don't break — the page skips rendering
-- a section when its data is missing.

alter table products add column if not exists serving_size_g numeric;
alter table products add column if not exists serves_per_container integer;
alter table products add column if not exists net_weight_g numeric;
alter table products add column if not exists directions text;
alter table products add column if not exists ingredients text;

update products
set
  serving_size_g = 5,
  serves_per_container = 60,
  net_weight_g = 300,
  directions = 'Mix 5g (1 scoop) with 200–250ml of water daily, or as directed by a healthcare professional.',
  ingredients = 'Creatine Monohydrate (100%).'
where slug = 'creatine-mono-500g';

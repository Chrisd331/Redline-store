-- ============================================================
--  Redline Supplements — Products: fix unsubstantiated testing claim
--  Paste this whole file into Supabase -> SQL Editor -> Run
-- ============================================================

-- "highly tested" implied product testing that hasn't been done.
-- Replaced with facility-only wording (matches the Supplier
-- Documentation & Quality Credentials block on the product page).

update products
set description = 'Redline Supplements Creatine Monohydrate is a premium, pure formula made for those who demand more from their training. Manufactured in a facility holding SGS GMP, ISO 22000:2018 and HACCP certification. Batch documentation available on request.

With no fillers and no unnecessary additives, this unflavoured formula delivers 100% creatine monohydrate in every serve. It''s a simple, reliable addition to your daily routine and is designed for athletes, lifters and performance-focused individuals who value quality, consistency and trusted sourcing.

Whether you''re building your stack or keeping it simple, Redline Creatine is built around what matters most — purity, quality and consistency.'
where slug = 'creatine-mono-500g';

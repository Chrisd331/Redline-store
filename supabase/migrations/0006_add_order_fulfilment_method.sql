-- ============================================================
--  Redline Supplements — Orders: add fulfilment method
--  Paste this whole file into Supabase -> SQL Editor -> Run
-- ============================================================

-- Records whether an order was local pickup (Hammers Gym) or delivery,
-- so pickup vs delivery volume can be queried/counted.

alter table orders add column if not exists fulfilment_method text not null default 'delivery';

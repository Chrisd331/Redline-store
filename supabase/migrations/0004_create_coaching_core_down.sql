-- ============================================================
--  Rollback for 0004_create_coaching_core.sql
--  Paste into Supabase -> SQL Editor -> Run to fully undo that migration.
--  Drops in reverse dependency order. Does NOT touch profiles, athletes,
--  or anything from earlier migrations.
-- ============================================================

drop table if exists training_adherence_logs cascade;
drop table if exists nutrition_adherence_logs cascade;
drop table if exists step_logs cascade;
drop table if exists sleep_logs cascade;
drop table if exists body_weight_logs cascade;

drop table if exists meal_logs cascade;
drop table if exists diet_swap_rules cascade;
drop table if exists meal_items cascade;
drop table if exists meals cascade;
drop table if exists plan_days cascade;
drop table if exists plans cascade;

drop table if exists session_exercise_logs cascade;
drop table if exists training_session_logs cascade;
drop table if exists session_exercises cascade;
drop table if exists training_sessions cascade;
drop table if exists training_programs cascade;

drop function if exists public.is_assigned_coach(uuid);

drop table if exists coach_client_assignments cascade;

drop function if exists public.set_updated_at();

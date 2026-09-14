-- ============================================================
--  Redline Coaching — Core schema (plans, training, diet, logs)
--  Paste this whole file into Supabase -> SQL Editor -> Run
--
--  SCOPE: tables + RLS only. No screens/UI are wired to this yet.
--  Reuses the existing `profiles` table (id = auth.users.id, role
--  defaults to 'client') as the single source of truth for both
--  clients and coaches — a coach is just a profile with role='coach'.
-- ============================================================

-- ---------- Shared helpers ----------

-- Every table below gets an `updated_at` column kept current by this
-- one trigger function, instead of repeating the logic per table.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Coach ⇄ client relationship ----------
-- The single source of truth for "which coach can touch which client's
-- data". Every other table's coach access policy goes through this via
-- is_assigned_coach() below — never through a table's own coach_id column
-- (that column is just "who authored this", not an access grant).

create table if not exists coach_client_assignments (
  id          uuid primary key default gen_random_uuid(),
  coach_id    uuid not null references profiles(id) on delete cascade,
  client_id   uuid not null references profiles(id) on delete cascade,
  status      text not null default 'active' check (status in ('active', 'ended')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (coach_id, client_id)
);
create index if not exists idx_cca_client on coach_client_assignments (client_id);
create index if not exists idx_cca_coach on coach_client_assignments (coach_id);

-- security definer: lets this run as the table owner so it isn't blocked
-- by coach_client_assignments' own RLS when called from inside another
-- table's policy (the same pattern used by handle_new_user() in 0003).
create or replace function public.is_assigned_coach(p_client_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from coach_client_assignments
    where coach_id = auth.uid()
      and client_id = p_client_id
      and status = 'active'
  );
$$;

grant execute on function public.is_assigned_coach(uuid) to authenticated, anon;

alter table coach_client_assignments enable row level security;

drop policy if exists "coach or client can view the assignment" on coach_client_assignments;
create policy "coach or client can view the assignment"
  on coach_client_assignments for select
  using (auth.uid() = coach_id or auth.uid() = client_id);

-- No insert/update/delete policy: assigning a coach to a client is an
-- admin action for now, done with the service-role key server-side, not
-- something either party can do to themselves via the browser.

create trigger set_updated_at before update on coach_client_assignments
  for each row execute function public.set_updated_at();

-- ---------- Training: programs -> sessions -> exercises ----------
-- These three tables are PRESCRIPTIVE: only an assigned coach can write
-- to them. A client can read but never edit their own program/session/
-- exercise targets.

create table if not exists training_programs (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references profiles(id) on delete cascade,
  coach_id    uuid references profiles(id) on delete set null,
  name        text not null,
  status      text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_training_programs_client on training_programs (client_id);
create index if not exists idx_training_programs_status on training_programs (status);

create table if not exists training_sessions (
  id            uuid primary key default gen_random_uuid(),
  program_id    uuid not null references training_programs(id) on delete cascade,
  client_id     uuid not null references profiles(id) on delete cascade,
  name          text not null,
  session_date  date,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_training_sessions_program on training_sessions (program_id);
create index if not exists idx_training_sessions_client on training_sessions (client_id);
create index if not exists idx_training_sessions_date on training_sessions (session_date);

create table if not exists session_exercises (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references training_sessions(id) on delete cascade,
  client_id     uuid not null references profiles(id) on delete cascade,
  name          text not null,
  sort_order    integer not null default 0,
  target_sets   integer,
  target_reps   integer,
  target_load   numeric,
  target_rpe    numeric check (target_rpe is null or (target_rpe between 0 and 10)),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_session_exercises_session on session_exercises (session_id);
create index if not exists idx_session_exercises_client on session_exercises (client_id);

-- CLIENT-EDITABLE logs live in separate tables from the prescription
-- above, on purpose: it's the only clean way to let a client mark their
-- own session/set as done without also letting them rewrite what was
-- prescribed. Same split is used for diet below.

create table if not exists training_session_logs (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references training_sessions(id) on delete cascade,
  client_id     uuid not null references profiles(id) on delete cascade,
  completed     boolean not null default false,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (session_id)
);
create index if not exists idx_training_session_logs_client on training_session_logs (client_id);

create table if not exists session_exercise_logs (
  id                  uuid primary key default gen_random_uuid(),
  session_exercise_id uuid not null references session_exercises(id) on delete cascade,
  session_id          uuid not null references training_sessions(id) on delete cascade,
  client_id           uuid not null references profiles(id) on delete cascade,
  set_number          integer not null,
  actual_reps         integer,
  actual_load         numeric,
  actual_rpe          numeric check (actual_rpe is null or (actual_rpe between 0 and 10)),
  completed           boolean not null default false,
  logged_at           timestamptz not null default now(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (session_exercise_id, set_number)
);
create index if not exists idx_session_exercise_logs_session on session_exercise_logs (session_id);
create index if not exists idx_session_exercise_logs_client on session_exercise_logs (client_id);

-- ---------- Nutrition: plans -> plan_days -> meals -> meal_items ----------

create table if not exists plans (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references profiles(id) on delete cascade,
  coach_id    uuid references profiles(id) on delete set null,
  status      text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  calories    integer,
  protein_g   integer,
  carbs_g     integer,
  fats_g      integer,
  start_date  date,
  end_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_plans_client on plans (client_id);
create index if not exists idx_plans_coach on plans (coach_id);
create index if not exists idx_plans_status on plans (status);

create table if not exists plan_days (
  id                  uuid primary key default gen_random_uuid(),
  plan_id             uuid not null references plans(id) on delete cascade,
  client_id           uuid not null references profiles(id) on delete cascade,
  date                date not null,
  day_type            text not null check (day_type in ('high', 'low', 'refeed')),
  calories            integer,
  protein_g           integer,
  carbs_g             integer,
  fats_g              integer,
  training_session_id uuid references training_sessions(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (plan_id, date)
);
create index if not exists idx_plan_days_plan on plan_days (plan_id);
create index if not exists idx_plan_days_client on plan_days (client_id);
create index if not exists idx_plan_days_date on plan_days (date);

create table if not exists meals (
  id                uuid primary key default gen_random_uuid(),
  plan_day_id       uuid not null references plan_days(id) on delete cascade,
  client_id         uuid not null references profiles(id) on delete cascade,
  label             text not null,
  description       text,
  sort_order        integer not null default 0,
  target_calories   integer,
  target_protein_g  integer,
  target_carbs_g    integer,
  target_fats_g     integer,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_meals_plan_day on meals (plan_day_id);
create index if not exists idx_meals_client on meals (client_id);

create table if not exists meal_items (
  id          uuid primary key default gen_random_uuid(),
  meal_id     uuid not null references meals(id) on delete cascade,
  client_id   uuid not null references profiles(id) on delete cascade,
  name        text not null,
  quantity    numeric,
  unit        text,
  calories    integer,
  protein_g   integer,
  carbs_g     integer,
  fats_g      integer,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_meal_items_meal on meal_items (meal_id);
create index if not exists idx_meal_items_client on meal_items (client_id);

-- Plan-level "swap" rules (e.g. "Protein for protein — matched serving
-- only"), prescribed by the coach for the whole plan.
create table if not exists diet_swap_rules (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references plans(id) on delete cascade,
  client_id   uuid not null references profiles(id) on delete cascade,
  title       text not null,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_diet_swap_rules_plan on diet_swap_rules (plan_id);
create index if not exists idx_diet_swap_rules_client on diet_swap_rules (client_id);

-- CLIENT-EDITABLE: ticking a meal off, same split-table pattern as training.
create table if not exists meal_logs (
  id            uuid primary key default gen_random_uuid(),
  meal_id       uuid not null references meals(id) on delete cascade,
  client_id     uuid not null references profiles(id) on delete cascade,
  completed     boolean not null default false,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (meal_id)
);
create index if not exists idx_meal_logs_client on meal_logs (client_id);

-- ---------- Daily wellness / adherence logs ----------
-- Pure client-entered data (or coach-corrected). Nothing here is ever
-- "prescribed", so clients can write their own rows freely.

create table if not exists body_weight_logs (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references profiles(id) on delete cascade,
  log_date    date not null,
  weight_kg   numeric not null check (weight_kg > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (client_id, log_date)
);

create table if not exists sleep_logs (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references profiles(id) on delete cascade,
  log_date        date not null,
  duration_hours  numeric check (duration_hours is null or (duration_hours between 0 and 24)),
  quality         text check (quality is null or quality in ('poor', 'fair', 'good', 'great')),
  wake_ups        integer check (wake_ups is null or wake_ups >= 0),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (client_id, log_date)
);

create table if not exists step_logs (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references profiles(id) on delete cascade,
  log_date    date not null,
  steps       integer not null check (steps >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (client_id, log_date)
);

create table if not exists nutrition_adherence_logs (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references profiles(id) on delete cascade,
  plan_day_id     uuid references plan_days(id) on delete set null,
  log_date        date not null,
  adherence_pct   numeric check (adherence_pct is null or (adherence_pct between 0 and 100)),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (client_id, log_date)
);
create index if not exists idx_nutrition_adherence_plan_day on nutrition_adherence_logs (plan_day_id);

create table if not exists training_adherence_logs (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references profiles(id) on delete cascade,
  session_id      uuid references training_sessions(id) on delete set null,
  log_date        date not null,
  adherence_pct   numeric check (adherence_pct is null or (adherence_pct between 0 and 100)),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (client_id, log_date)
);
create index if not exists idx_training_adherence_session on training_adherence_logs (session_id);

-- ============================================================
--  Row Level Security
-- ============================================================

alter table training_programs         enable row level security;
alter table training_sessions         enable row level security;
alter table session_exercises         enable row level security;
alter table training_session_logs     enable row level security;
alter table session_exercise_logs     enable row level security;
alter table plans                     enable row level security;
alter table plan_days                 enable row level security;
alter table meals                     enable row level security;
alter table meal_items                enable row level security;
alter table diet_swap_rules           enable row level security;
alter table meal_logs                 enable row level security;
alter table body_weight_logs          enable row level security;
alter table sleep_logs                enable row level security;
alter table step_logs                 enable row level security;
alter table nutrition_adherence_logs  enable row level security;
alter table training_adherence_logs   enable row level security;

-- ---- Prescriptive tables: client reads, only the assigned coach writes ----
-- (training_programs, training_sessions, session_exercises, plans,
--  plan_days, meals, meal_items, diet_swap_rules)

drop policy if exists "read own or assigned" on training_programs;
create policy "read own or assigned" on training_programs for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "coach writes" on training_programs;
create policy "coach writes" on training_programs for insert
  with check (public.is_assigned_coach(client_id));
drop policy if exists "coach updates" on training_programs;
create policy "coach updates" on training_programs for update
  using (public.is_assigned_coach(client_id)) with check (public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on training_sessions;
create policy "read own or assigned" on training_sessions for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "coach writes" on training_sessions;
create policy "coach writes" on training_sessions for insert
  with check (public.is_assigned_coach(client_id));
drop policy if exists "coach updates" on training_sessions;
create policy "coach updates" on training_sessions for update
  using (public.is_assigned_coach(client_id)) with check (public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on session_exercises;
create policy "read own or assigned" on session_exercises for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "coach writes" on session_exercises;
create policy "coach writes" on session_exercises for insert
  with check (public.is_assigned_coach(client_id));
drop policy if exists "coach updates" on session_exercises;
create policy "coach updates" on session_exercises for update
  using (public.is_assigned_coach(client_id)) with check (public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on plans;
create policy "read own or assigned" on plans for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "coach writes" on plans;
create policy "coach writes" on plans for insert
  with check (public.is_assigned_coach(client_id));
drop policy if exists "coach updates" on plans;
create policy "coach updates" on plans for update
  using (public.is_assigned_coach(client_id)) with check (public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on plan_days;
create policy "read own or assigned" on plan_days for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "coach writes" on plan_days;
create policy "coach writes" on plan_days for insert
  with check (public.is_assigned_coach(client_id));
drop policy if exists "coach updates" on plan_days;
create policy "coach updates" on plan_days for update
  using (public.is_assigned_coach(client_id)) with check (public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on meals;
create policy "read own or assigned" on meals for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "coach writes" on meals;
create policy "coach writes" on meals for insert
  with check (public.is_assigned_coach(client_id));
drop policy if exists "coach updates" on meals;
create policy "coach updates" on meals for update
  using (public.is_assigned_coach(client_id)) with check (public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on meal_items;
create policy "read own or assigned" on meal_items for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "coach writes" on meal_items;
create policy "coach writes" on meal_items for insert
  with check (public.is_assigned_coach(client_id));
drop policy if exists "coach updates" on meal_items;
create policy "coach updates" on meal_items for update
  using (public.is_assigned_coach(client_id)) with check (public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on diet_swap_rules;
create policy "read own or assigned" on diet_swap_rules for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "coach writes" on diet_swap_rules;
create policy "coach writes" on diet_swap_rules for insert
  with check (public.is_assigned_coach(client_id));
drop policy if exists "coach updates" on diet_swap_rules;
create policy "coach updates" on diet_swap_rules for update
  using (public.is_assigned_coach(client_id)) with check (public.is_assigned_coach(client_id));

-- ---- Client-editable logs: client owns their rows, assigned coach can also read/write ----
-- (training_session_logs, session_exercise_logs, meal_logs,
--  body_weight_logs, sleep_logs, step_logs,
--  nutrition_adherence_logs, training_adherence_logs)

drop policy if exists "read own or assigned" on training_session_logs;
create policy "read own or assigned" on training_session_logs for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach writes" on training_session_logs;
create policy "client or coach writes" on training_session_logs for insert
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach updates" on training_session_logs;
create policy "client or coach updates" on training_session_logs for update
  using (auth.uid() = client_id or public.is_assigned_coach(client_id))
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on session_exercise_logs;
create policy "read own or assigned" on session_exercise_logs for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach writes" on session_exercise_logs;
create policy "client or coach writes" on session_exercise_logs for insert
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach updates" on session_exercise_logs;
create policy "client or coach updates" on session_exercise_logs for update
  using (auth.uid() = client_id or public.is_assigned_coach(client_id))
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on meal_logs;
create policy "read own or assigned" on meal_logs for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach writes" on meal_logs;
create policy "client or coach writes" on meal_logs for insert
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach updates" on meal_logs;
create policy "client or coach updates" on meal_logs for update
  using (auth.uid() = client_id or public.is_assigned_coach(client_id))
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on body_weight_logs;
create policy "read own or assigned" on body_weight_logs for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach writes" on body_weight_logs;
create policy "client or coach writes" on body_weight_logs for insert
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach updates" on body_weight_logs;
create policy "client or coach updates" on body_weight_logs for update
  using (auth.uid() = client_id or public.is_assigned_coach(client_id))
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on sleep_logs;
create policy "read own or assigned" on sleep_logs for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach writes" on sleep_logs;
create policy "client or coach writes" on sleep_logs for insert
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach updates" on sleep_logs;
create policy "client or coach updates" on sleep_logs for update
  using (auth.uid() = client_id or public.is_assigned_coach(client_id))
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on step_logs;
create policy "read own or assigned" on step_logs for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach writes" on step_logs;
create policy "client or coach writes" on step_logs for insert
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach updates" on step_logs;
create policy "client or coach updates" on step_logs for update
  using (auth.uid() = client_id or public.is_assigned_coach(client_id))
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on nutrition_adherence_logs;
create policy "read own or assigned" on nutrition_adherence_logs for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach writes" on nutrition_adherence_logs;
create policy "client or coach writes" on nutrition_adherence_logs for insert
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach updates" on nutrition_adherence_logs;
create policy "client or coach updates" on nutrition_adherence_logs for update
  using (auth.uid() = client_id or public.is_assigned_coach(client_id))
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));

drop policy if exists "read own or assigned" on training_adherence_logs;
create policy "read own or assigned" on training_adherence_logs for select
  using (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach writes" on training_adherence_logs;
create policy "client or coach writes" on training_adherence_logs for insert
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));
drop policy if exists "client or coach updates" on training_adherence_logs;
create policy "client or coach updates" on training_adherence_logs for update
  using (auth.uid() = client_id or public.is_assigned_coach(client_id))
  with check (auth.uid() = client_id or public.is_assigned_coach(client_id));

-- No delete policies anywhere in this migration: rows are archived via
-- status columns, not deleted, for both clients and coaches. Hard deletes
-- remain a service-role-only operation if ever needed.

-- ============================================================
--  updated_at triggers — one per table, all using the same function
-- ============================================================

create trigger set_updated_at before update on training_programs        for each row execute function public.set_updated_at();
create trigger set_updated_at before update on training_sessions        for each row execute function public.set_updated_at();
create trigger set_updated_at before update on session_exercises        for each row execute function public.set_updated_at();
create trigger set_updated_at before update on training_session_logs    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on session_exercise_logs    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on plans                    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on plan_days                for each row execute function public.set_updated_at();
create trigger set_updated_at before update on meals                    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on meal_items               for each row execute function public.set_updated_at();
create trigger set_updated_at before update on diet_swap_rules          for each row execute function public.set_updated_at();
create trigger set_updated_at before update on meal_logs                for each row execute function public.set_updated_at();
create trigger set_updated_at before update on body_weight_logs         for each row execute function public.set_updated_at();
create trigger set_updated_at before update on sleep_logs               for each row execute function public.set_updated_at();
create trigger set_updated_at before update on step_logs                for each row execute function public.set_updated_at();
create trigger set_updated_at before update on nutrition_adherence_logs for each row execute function public.set_updated_at();
create trigger set_updated_at before update on training_adherence_logs  for each row execute function public.set_updated_at();

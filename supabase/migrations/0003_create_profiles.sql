-- ============================================================
--  Redline Supplements — Profiles (linked to Supabase Auth)
--  Paste this whole file into Supabase -> SQL Editor -> Run
-- ============================================================

-- ---------- Table ----------
-- id    = same UUID as the row in auth.users (1:1)
-- role  = 'client' by default. Set a user's row to 'coach' manually in the
--         Table Editor for now — no UI for changing roles yet.

create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  role        text not null default 'client',
  created_at  timestamptz not null default now()
);

-- ---------- Row Level Security ----------
-- A user can read and edit ONLY the row whose id matches their own auth uid.
-- There is no policy allowing anyone to select/update a row that isn't theirs,
-- and no insert/delete policy for regular users at all (see trigger below).

alter table profiles enable row level security;

drop policy if exists "individuals can view own profile" on profiles;
create policy "individuals can view own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "individuals can update own profile" on profiles;
create policy "individuals can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No insert/delete policies => denied for regular users by default.
-- Profile rows are created automatically by the trigger below, and the
-- service-role key (used server-side only) can still manage rows directly.

-- ---------- Auto-create a profile row whenever someone signs up ----------
-- security definer lets this function bypass RLS just for this one
-- controlled insert — it runs as the table owner, not as the new user.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

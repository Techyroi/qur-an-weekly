
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  selected_plan text check (selected_plan in ('7','15','30')),
  mushaf text default 'madinah' check (mushaf in ('madinah','hafs')),
  reminder_enabled boolean not null default false,
  reminder_time text not null default '06:00',
  theme text not null default 'light' check (theme in ('light','dark')),
  language text not null default 'en',
  onboarded boolean not null default false,
  cycle_start timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- plan_progress
create table public.plan_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null check (plan_type in ('7','15','30')),
  day_number int not null,
  title text not null,
  start_surah text not null,
  end_surah text not null,
  estimated_pages int not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, plan_type, day_number)
);
alter table public.plan_progress enable row level security;
create policy "own progress select" on public.plan_progress for select using (auth.uid() = user_id);
create policy "own progress insert" on public.plan_progress for insert with check (auth.uid() = user_id);
create policy "own progress update" on public.plan_progress for update using (auth.uid() = user_id);
create policy "own progress delete" on public.plan_progress for delete using (auth.uid() = user_id);

-- user_stats
create table public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  cycles_completed int not null default 0,
  last_completion_date date,
  updated_at timestamptz not null default now()
);
alter table public.user_stats enable row level security;
create policy "own stats select" on public.user_stats for select using (auth.uid() = user_id);
create policy "own stats insert" on public.user_stats for insert with check (auth.uid() = user_id);
create policy "own stats update" on public.user_stats for update using (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- handle new user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  insert into public.user_stats (user_id) values (new.id);
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

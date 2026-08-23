-- LifeOS AI — Supabase schema
-- Every table is scoped to auth.uid() through row level security.

create extension if not exists "pgcrypto";

create type life_area as enum ('work','health','finance','learning','personal','relationships');
create type task_status as enum ('todo','in_progress','done');
create type task_priority as enum ('low','medium','high');

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text,
  timezone text default 'UTC',
  working_hours jsonb default '{"start":"09:00","end":"18:00"}'::jsonb,
  plan text default 'free',
  created_at timestamptz default now()
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  description text default '',
  area life_area not null default 'personal',
  target_date date,
  progress int not null default 0 check (progress between 0 and 100),
  milestones jsonb not null default '[]'::jsonb,
  metric jsonb,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  goal_id uuid references goals on delete set null,
  title text not null,
  notes text,
  status task_status not null default 'todo',
  priority task_priority not null default 'medium',
  area life_area not null default 'personal',
  due_date date,
  estimate_minutes int not null default 30,
  ai_suggested boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  area life_area not null default 'work',
  kind text not null default 'focus',
  location text,
  attendees text[] default '{}'
);

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  cadence text not null default 'daily',
  area life_area not null default 'personal',
  time_of_day text not null default 'morning',
  streak int not null default 0,
  best_streak int not null default 0,
  created_at timestamptz default now()
);

create table if not exists habit_entries (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  entry_date date not null,
  completed boolean not null default true,
  unique (habit_id, entry_date)
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  content text default '',
  tags text[] default '{}',
  pinned boolean not null default false,
  ai_summary text,
  updated_at timestamptz default now()
);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plan_date date not null,
  blocks jsonb not null default '[]'::jsonb,
  generated_at timestamptz default now(),
  unique (user_id, plan_date)
);

alter table profiles enable row level security;
alter table goals enable row level security;
alter table tasks enable row level security;
alter table events enable row level security;
alter table habits enable row level security;
alter table habit_entries enable row level security;
alter table notes enable row level security;
alter table plans enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

do $$
declare t text;
begin
  foreach t in array array['goals','tasks','events','habits','habit_entries','notes','plans'] loop
    execute format(
      'create policy "own rows" on %I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);',
      t
    );
  end loop;
end $$;

create index if not exists tasks_user_due_idx on tasks (user_id, due_date);
create index if not exists events_user_start_idx on events (user_id, starts_at);
create index if not exists notes_user_updated_idx on notes (user_id, updated_at desc);

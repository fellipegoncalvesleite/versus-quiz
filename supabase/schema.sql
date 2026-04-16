-- Versus Quiz - Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db reset`) once per project.

-- ROOMS: a joinable private lobby identified by a short code.
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  host_player_id uuid,
  quiz_id text not null default 'world_countries',
  time_limit_seconds integer,           -- null = untimed
  status text not null default 'lobby', -- lobby | playing | finished
  created_at timestamptz not null default now()
);
create index if not exists rooms_code_idx on public.rooms(code);

-- PLAYERS: guest players bound to a room. identified by a client-generated uuid.
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  nickname text not null,
  color text not null,
  score integer not null default 0,
  joined_at timestamptz not null default now()
);
create index if not exists players_room_idx on public.players(room_id);

-- GAME SESSIONS: one per game played in a room (rematches create new sessions).
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  quiz_id text not null,
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  finished_at timestamptz
);
create index if not exists game_sessions_room_idx on public.game_sessions(room_id);

-- CLAIMED ANSWERS: an answer item locked by a player in a session. unique per (session,item).
create table if not exists public.claimed_answers (
  id bigserial primary key,
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  item_id text not null,
  player_id uuid not null references public.players(id) on delete cascade,
  claimed_at timestamptz not null default now(),
  unique (session_id, item_id)
);
create index if not exists claimed_session_idx on public.claimed_answers(session_id);

-- Enable realtime on the tables clients subscribe to.
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.game_sessions;
alter publication supabase_realtime add table public.claimed_answers;

-- Permissive RLS for MVP: clients read, server (service role) writes.
alter table public.rooms enable row level security;
alter table public.players enable row level security;
alter table public.game_sessions enable row level security;
alter table public.claimed_answers enable row level security;

create policy "read rooms" on public.rooms for select using (true);
create policy "read players" on public.players for select using (true);
create policy "read sessions" on public.game_sessions for select using (true);
create policy "read claimed" on public.claimed_answers for select using (true);

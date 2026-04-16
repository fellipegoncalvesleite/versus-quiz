# Versus Quiz 

Real-time multiplayer typing quiz. Players join a private room by code, pick a quiz, and race to type valid answers. First correct claim locks the answer globally and colors it with the claimer's color. Classic geography typing quiz energy, turned multiplayer.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Realtime) for state and subscriptions
- Server-authoritative claim validation via Next.js API routes

## Project layout

```
versus-quiz/
├── src/
│   ├── app/
│   │   ├── page.tsx                       home (create/join)
│   │   ├── room/[code]/page.tsx           room route -> RoomClient
│   │   ├── room/[code]/RoomClient.tsx     realtime state + lobby/game/results switch
│   │   └── api/rooms/                     create, join, start, claim, end, rematch
│   ├── components/                        Lobby, Game, Results, MapBoard, ListBoard, ClaimFeed, PlayerBadges
│   ├── data/quizzes/*.json                seed datasets
│   └── lib/
│       ├── normalize.ts                   answer normalization
│       ├── quizzes.ts                     dataset loader + matchAnswer
│       ├── roomCode.ts                    short code generator
│       ├── colors.ts                      player color palette
│       └── supabase/{client,server}.ts    browser + service-role clients
└── supabase/schema.sql                    DB schema
```

## Database

See `supabase/schema.sql`. Tables: `rooms`, `players`, `game_sessions`, `claimed_answers`. The unique `(session_id, item_id)` constraint on `claimed_answers` is what guarantees first-claim wins — conflicting inserts fail atomically.

Realtime is enabled on all four tables.

## Gameplay flow

1. **Home** — pick Create or Join, enter nickname, pick quiz + time limit (2/5/10 min or untimed).
2. **Lobby** — room code is shown; up to 6 players; host sees start button.
3. **Game** — single input box, continuously validated with ~80 ms debounce. On exact match (case/accent/punctuation-insensitive, aliases supported) the client POSTs to `/api/.../claim` and the server performs an atomic insert. Success = input clears, score +1, everyone sees it colored. Invalid/locked = brief red flash. Repeated invalid spam is rate-limited (12 attempts / 3 s per player).
4. **Results** — final scores, missed items, host rematch button.

## Local setup

### 1. Supabase project

Create a project at https://supabase.com. In SQL editor, paste and run `supabase/schema.sql`.

Enable realtime (already done by the `alter publication` lines in the schema).

### 2. Env vars

```bash
cp .env.example .env.local
# then fill in:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...   # server-only, used by API routes
```

### 3. Install + run

```bash
npm install
npm run dev
```

Open two browser windows to `http://localhost:3000` to play against yourself.

## Quizzes

Seed datasets live in `src/data/quizzes/`:

- `world_countries.json` — map mode (~100 countries)
- `us_states.json` — map mode (50 states)
- `world_capitals.json` — list mode
- `us_universities.json` — list mode
- `ucl_winners.json` — list mode

Each item: `{ id, answer, aliases[], region? }`.

### Map rendering

MVP renders map-mode quizzes as an SVG grid of region tiles (labeled with region codes). To use real maps, swap `src/components/MapBoard.tsx` for a component that renders GeoJSON `<path>`s keyed by the same `item.region` id — the color lookup API (`colorOf(itemId)`) stays the same.

## Answer matching

`src/lib/normalize.ts` lowercases, strips diacritics, collapses whitespace, and drops most punctuation. `matchAnswer` compares the normalized input against the normalized canonical answer and every alias. Only exact matches claim (no prefix matching) so partial typing never steals an answer mid-word.

## Notes / non-goals

- No auth. Players are identified by a uuid stored in `localStorage` keyed by room code.
- No reconnect-on-disconnect logic beyond the browser naturally rejoining realtime.
- Rate limiting is in-process — fine for a single Vercel/Node instance MVP. Replace with Redis or a Supabase table counter for multi-instance.
- Map tiles are placeholders; drop in proper GeoJSON when you're ready.

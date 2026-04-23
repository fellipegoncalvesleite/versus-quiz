# Versus Quiz

Real-time multiplayer typing quiz. Join a private room by code, pick a quiz, race to type correct answers. First claim locks the answer and colors it. Geography, sports, education — solo or versus.

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS
- Supabase (Postgres + Realtime)
- Server-authoritative claim validation

## Setup

```bash
cp .env.example .env.local
# fill in your Supabase project URL, anon public key, and service_role key
npm install
npm run dev
```

Run `supabase/schema.sql` in your Supabase SQL editor before starting.

Use `SUPABASE_SERVICE_ROLE_KEY` for server writes. Do not use the project's JWT secret; Supabase will reject it as an invalid API key.

## Quizzes

- World Countries (map)
- US States (map)
- World Capitals (list)
- Famous US Universities (list)
- Champions League Winners (list)

Datasets in `src/data/quizzes/`. Each item has `id`, `answer`, `aliases[]`, optional `region`.

## How it works

Rooms are private, 2–6 players. Input is validated client-side with debounce, then confirmed server-side via atomic insert (unique constraint on `session_id, item_id`). First valid insert wins. Scores update in real-time through Supabase subscriptions.

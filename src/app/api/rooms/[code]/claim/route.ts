import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { matchAnswer } from "@/lib/quizzes";

// Per-player invalid-attempt rate limiter (in-process; fine for a single-node MVP).
const spam = new Map<string, { count: number; resetAt: number }>();
const SPAM_WINDOW_MS = 3000;
const SPAM_MAX = 12;

function rateLimited(playerId: string): boolean {
  const now = Date.now();
  const rec = spam.get(playerId);
  if (!rec || now > rec.resetAt) {
    spam.set(playerId, { count: 1, resetAt: now + SPAM_WINDOW_MS });
    return false;
  }
  rec.count++;
  return rec.count > SPAM_MAX;
}

// POST /api/rooms/[code]/claim  { player_id, session_id, input } -> { item_id? , locked? , invalid? }
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json();
  const playerId = String(body.player_id ?? "");
  const sessionId = String(body.session_id ?? "");
  const input = String(body.input ?? "");

  if (!playerId || !sessionId) return NextResponse.json({ error: "bad request" }, { status: 400 });
  if (rateLimited(playerId)) return NextResponse.json({ rateLimited: true }, { status: 429 });

  const db = supabaseAdmin();
  const { data: room } = await db.from("rooms").select("*").eq("code", code.toUpperCase()).maybeSingle();
  if (!room || room.status !== "playing") return NextResponse.json({ error: "not playing" }, { status: 409 });

  const { data: session } = await db.from("game_sessions").select("*").eq("id", sessionId).maybeSingle();
  if (!session || session.finished_at) return NextResponse.json({ error: "session over" }, { status: 409 });
  if (session.ends_at && new Date(session.ends_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "time up" }, { status: 409 });
  }

  const itemId = matchAnswer(session.quiz_id, input);
  if (!itemId) return NextResponse.json({ invalid: true });

  // Atomic first-claim: unique(session_id, item_id) on the table. If insert fails on conflict -> already locked.
  const { data: claim, error } = await db
    .from("claimed_answers")
    .insert({ session_id: sessionId, item_id: itemId, player_id: playerId })
    .select()
    .single();

  if (error) {
    // 23505 = unique_violation (already claimed).
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ locked: true, item_id: itemId });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Increment player score. Fetch-then-update is fine for MVP scale.
  const { data: player } = await db.from("players").select("score").eq("id", playerId).single();
  if (player) {
    await db.from("players").update({ score: (player.score ?? 0) + 1 }).eq("id", playerId);
  }

  return NextResponse.json({ claimed: true, item_id: itemId, claim_id: claim.id });
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// POST /api/rooms/[code]/start { player_id, quiz_id?, time_limit_seconds? } (host only)
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json();
  const playerId = String(body.player_id ?? "");
  const quizId = body.quiz_id ? String(body.quiz_id) : undefined;
  const timeLimit = body.time_limit_seconds === undefined ? undefined : (body.time_limit_seconds === null ? null : Number(body.time_limit_seconds));

  const db = supabaseAdmin();
  const { data: room } = await db.from("rooms").select("*").eq("code", code.toUpperCase()).maybeSingle();
  if (!room) return NextResponse.json({ error: "room not found" }, { status: 404 });
  if (room.host_player_id !== playerId) return NextResponse.json({ error: "not host" }, { status: 403 });

  const updates: Record<string, unknown> = { status: "playing" };
  if (quizId !== undefined) updates.quiz_id = quizId;
  if (timeLimit !== undefined) updates.time_limit_seconds = timeLimit;
  await db.from("rooms").update(updates).eq("id", room.id);

  // Reset all player scores for this game.
  await db.from("players").update({ score: 0 }).eq("room_id", room.id);

  const started = new Date();
  const endsAt = timeLimit ?? room.time_limit_seconds
    ? new Date(started.getTime() + ((timeLimit ?? room.time_limit_seconds) as number) * 1000).toISOString()
    : null;

  const { data: session, error } = await db
    .from("game_sessions")
    .insert({
      room_id: room.id,
      quiz_id: quizId ?? room.quiz_id,
      started_at: started.toISOString(),
      ends_at: endsAt,
    })
    .select()
    .single();
  if (error || !session) return NextResponse.json({ error: error?.message ?? "start failed" }, { status: 500 });

  return NextResponse.json({ session_id: session.id, ends_at: endsAt });
}

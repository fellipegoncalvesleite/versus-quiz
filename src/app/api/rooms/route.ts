import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { supabaseConfigResponse, supabaseQueryErrorResponse } from "@/lib/supabase/errors";
import { generateRoomCode } from "@/lib/roomCode";
import { pickColor } from "@/lib/colors";
import { getQuiz } from "@/lib/quizzes";

// POST /api/rooms  { nickname, quiz_id, time_limit_seconds }  -> { code, room_id, player_id }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const nickname = String(body.nickname ?? "").trim().slice(0, 20);
  const quizId = String(body.quiz_id ?? "world_countries");
  const timeLimit = body.time_limit_seconds === null ? null : Number(body.time_limit_seconds);

  if (!nickname) return NextResponse.json({ error: "nickname required" }, { status: 400 });
  if (!getQuiz(quizId)) return NextResponse.json({ error: "unknown quiz" }, { status: 400 });

  let db: ReturnType<typeof supabaseAdmin>;
  try {
    db = supabaseAdmin();
  } catch (error) {
    const response = supabaseConfigResponse(error);
    if (response) return response;
    throw error;
  }

  // Retry on code collision.
  let code = "";
  for (let i = 0; i < 6; i++) {
    code = generateRoomCode();
    const { data, error } = await db.from("rooms").select("id").eq("code", code).maybeSingle();
    if (error) return supabaseQueryErrorResponse(error, "room lookup failed");
    if (!data) break;
  }

  const { data: room, error: roomErr } = await db
    .from("rooms")
    .insert({ code, quiz_id: quizId, time_limit_seconds: timeLimit, status: "lobby" })
    .select()
    .single();
  if (roomErr || !room) return supabaseQueryErrorResponse(roomErr, "room insert failed");

  const color = pickColor([]);
  const { data: player, error: playerErr } = await db
    .from("players")
    .insert({ room_id: room.id, nickname, color })
    .select()
    .single();
  if (playerErr || !player) return supabaseQueryErrorResponse(playerErr, "player insert failed");

  const { error: hostErr } = await db.from("rooms").update({ host_player_id: player.id }).eq("id", room.id);
  if (hostErr) return supabaseQueryErrorResponse(hostErr, "host update failed");

  return NextResponse.json({ code: room.code, room_id: room.id, player_id: player.id });
}

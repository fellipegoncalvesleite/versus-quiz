import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { pickColor } from "@/lib/colors";

const MAX_PLAYERS = 6;

// POST /api/rooms/[code]/join  { nickname } -> { room_id, player_id }
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json();
  const nickname = String(body.nickname ?? "").trim().slice(0, 20);
  if (!nickname) return NextResponse.json({ error: "nickname required" }, { status: 400 });

  const db = supabaseAdmin();
  const { data: room } = await db.from("rooms").select("*").eq("code", code.toUpperCase()).maybeSingle();
  if (!room) return NextResponse.json({ error: "room not found" }, { status: 404 });
  if (room.status !== "lobby") return NextResponse.json({ error: "room already started" }, { status: 409 });

  const { data: players } = await db.from("players").select("color").eq("room_id", room.id);
  if ((players?.length ?? 0) >= MAX_PLAYERS) return NextResponse.json({ error: "room full" }, { status: 409 });

  const color = pickColor((players ?? []).map((p) => p.color));
  const { data: player, error } = await db
    .from("players")
    .insert({ room_id: room.id, nickname, color })
    .select()
    .single();
  if (error || !player) return NextResponse.json({ error: error?.message ?? "join failed" }, { status: 500 });

  return NextResponse.json({ room_id: room.id, player_id: player.id });
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// POST /api/rooms/[code]/rematch { player_id } (host only) -> sets room back to lobby
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json();
  const playerId = String(body.player_id ?? "");

  const db = supabaseAdmin();
  const { data: room } = await db.from("rooms").select("*").eq("code", code.toUpperCase()).maybeSingle();
  if (!room) return NextResponse.json({ error: "room not found" }, { status: 404 });
  if (room.host_player_id !== playerId) return NextResponse.json({ error: "not host" }, { status: 403 });

  await db.from("rooms").update({ status: "lobby" }).eq("id", room.id);
  await db.from("players").update({ score: 0 }).eq("room_id", room.id);
  return NextResponse.json({ ok: true });
}

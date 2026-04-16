import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// POST /api/rooms/[code]/end { session_id } - idempotent; called by any client when timer hits 0.
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json();
  const sessionId = String(body.session_id ?? "");

  const db = supabaseAdmin();
  const { data: room } = await db.from("rooms").select("*").eq("code", code.toUpperCase()).maybeSingle();
  if (!room) return NextResponse.json({ error: "room not found" }, { status: 404 });

  await db.from("game_sessions").update({ finished_at: new Date().toISOString() }).eq("id", sessionId).is("finished_at", null);
  await db.from("rooms").update({ status: "finished" }).eq("id", room.id);
  return NextResponse.json({ ok: true });
}

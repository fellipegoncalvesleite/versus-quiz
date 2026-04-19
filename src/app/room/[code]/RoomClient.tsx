"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { getQuiz, listQuizzes } from "@/lib/quizzes";

const Lobby = dynamic(() => import("@/components/Lobby"), { loading: RoomLoading });
const Game = dynamic(() => import("@/components/Game"), { loading: RoomLoading });
const Results = dynamic(() => import("@/components/Results"), { loading: RoomLoading });

export type Room = {
  id: string;
  code: string;
  host_player_id: string | null;
  quiz_id: string;
  time_limit_seconds: number | null;
  status: "lobby" | "playing" | "finished";
};
export type Player = {
  id: string;
  room_id: string;
  nickname: string;
  color: string;
  score: number;
};
export type Session = {
  id: string;
  room_id: string;
  quiz_id: string;
  started_at: string;
  ends_at: string | null;
  finished_at: string | null;
};
export type Claim = {
  id: number;
  session_id: string;
  item_id: string;
  player_id: string;
  claimed_at: string;
};

export default function RoomClient({ code }: { code: string }) {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [me, setMe] = useState<{ roomId: string; playerId: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fetchedKey = useRef<string>("");

  // Load stored identity.
  useEffect(() => {
    const raw = localStorage.getItem(`vq:${code}`);
    if (!raw) {
      router.replace("/");
      return;
    }
    const parsed = JSON.parse(raw);
    setMe({ roomId: parsed.roomId, playerId: parsed.playerId });
  }, [code, router]);

  // Initial snapshot + realtime subscriptions.
  useEffect(() => {
    if (!me) return;
    const key = me.roomId;
    if (fetchedKey.current === key) return;
    fetchedKey.current = key;

    let active = true;

    async function loadAll() {
      if (!me) return;
      const [{ data: r }, { data: ps }, { data: ss }] = await Promise.all([
        supabase.from("rooms").select("*").eq("id", me.roomId).single(),
        supabase.from("players").select("*").eq("room_id", me.roomId),
        supabase.from("game_sessions").select("*").eq("room_id", me.roomId).order("started_at", { ascending: false }).limit(1),
      ]);
      if (!active) return;
      if (!r) { setErr("Room not found"); return; }
      setRoom(r as Room);
      setPlayers((ps ?? []) as Player[]);
      const latest = (ss ?? [])[0] as Session | undefined;
      if (latest) {
        setSession(latest);
        const { data: cs } = await supabase.from("claimed_answers").select("*").eq("session_id", latest.id);
        if (!active) return;
        setClaims((cs ?? []) as Claim[]);
      }
    }
    loadAll();

    const channel = supabase
      .channel(`room:${me.roomId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `id=eq.${me.roomId}` },
        (p) => { if (p.new) setRoom(p.new as Room); })
      .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: `room_id=eq.${me.roomId}` },
        (p) => {
          setPlayers((prev) => {
            if (p.eventType === "DELETE") return prev.filter((x) => x.id !== (p.old as Player).id);
            const next = p.new as Player;
            const idx = prev.findIndex((x) => x.id === next.id);
            if (idx === -1) return [...prev, next];
            const copy = prev.slice(); copy[idx] = next; return copy;
          });
        })
      .on("postgres_changes", { event: "*", schema: "public", table: "game_sessions", filter: `room_id=eq.${me.roomId}` },
        async (p) => {
          const next = p.new as Session;
          setSession(next);
          const { data: cs } = await supabase.from("claimed_answers").select("*").eq("session_id", next.id);
          setClaims((cs ?? []) as Claim[]);
        })
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, [me, supabase]);

  // Claims are scoped by session. Without this filter, busy production traffic from
  // other rooms can leak into the current room and force unnecessary re-renders.
  useEffect(() => {
    if (!session?.id) {
      setClaims([]);
      return;
    }

    let active = true;
    const channel = supabase
      .channel(`claims:${session.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "claimed_answers", filter: `session_id=eq.${session.id}` },
        (p) => {
          if (!active) return;
          const next = p.new as Claim;
          if (next.session_id !== session.id) return;
          setClaims((prev) => prev.some((c) => c.id === next.id) ? prev : [...prev, next]);
        })
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, [session?.id, supabase]);

  if (err) return <main className="min-h-screen flex items-center justify-center">{err}</main>;
  if (!room || !me) return <main className="min-h-screen flex items-center justify-center text-neutral-500">Loading…</main>;

  const quiz = getQuiz(room.quiz_id);
  if (!quiz) return <main className="min-h-screen flex items-center justify-center">Unknown quiz</main>;

  const meIsHost = room.host_player_id === me.playerId;

  if (room.status === "lobby") {
    return (
      <Lobby
        room={room}
        players={players}
        meId={me.playerId}
        isHost={meIsHost}
        quizzes={listQuizzes()}
      />
    );
  }
  if (room.status === "playing" && session) {
    return (
      <Game
        room={room}
        players={players}
        session={session}
        claims={claims}
        quiz={quiz}
        meId={me.playerId}
      />
    );
  }
  return <Results room={room} players={players} claims={claims} quiz={quiz} isHost={meIsHost} meId={me.playerId} />;
}

function RoomLoading() {
  return <main className="min-h-screen flex items-center justify-center text-neutral-500">Loading…</main>;
}

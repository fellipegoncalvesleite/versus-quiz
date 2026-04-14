"use client";
import { useState } from "react";
import type { Room, Player } from "@/app/room/[code]/RoomClient";
import PlayerBadges from "./PlayerBadges";

const TIME_OPTS: { label: string; value: number | null }[] = [
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
  { label: "Untimed", value: null },
];

export default function Lobby({
  room, players, meId, isHost, quizzes,
}: {
  room: Room; players: Player[]; meId: string; isHost: boolean;
  quizzes: { id: string; label: string; kind: string }[];
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [quizId, setQuizId] = useState(room.quiz_id);
  const [timeLimit, setTimeLimit] = useState<number | null>(room.time_limit_seconds);

  async function start() {
    if (players.length < 2) { setErr("Need at least 2 players"); return; }
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`/api/rooms/${room.code}/start`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ player_id: meId, quiz_id: quizId, time_limit_seconds: timeLimit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
    } catch (e: unknown) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto space-y-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Lobby</h1>
        <div className="text-right">
          <div className="text-xs text-neutral-500">Room code</div>
          <div className="text-2xl tracking-widest font-mono">{room.code}</div>
        </div>
      </header>

      <section>
        <h2 className="text-sm uppercase text-neutral-500 mb-2">Players ({players.length}/6)</h2>
        <PlayerBadges players={players} meId={meId} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase text-neutral-500">Quiz</h2>
        <select
          disabled={!isHost}
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 disabled:opacity-60"
        >
          {quizzes.map((q) => <option key={q.id} value={q.id}>{q.label}</option>)}
        </select>
        <div className="flex gap-2 flex-wrap">
          {TIME_OPTS.map((o) => (
            <button
              key={String(o.value)}
              disabled={!isHost}
              onClick={() => setTimeLimit(o.value)}
              className={`px-3 py-1.5 rounded border ${timeLimit === o.value ? "bg-white text-black border-white" : "border-neutral-700"} disabled:opacity-60`}
            >{o.label}</button>
          ))}
        </div>
      </section>

      {isHost ? (
        <button
          onClick={start}
          disabled={busy || players.length < 2}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded disabled:opacity-50"
        >
          {players.length < 2 ? "Waiting for players…" : "Start game"}
        </button>
      ) : (
        <p className="text-center text-neutral-500">Waiting for host to start…</p>
      )}
      {err && <p className="text-red-400 text-sm text-center">{err}</p>}
    </main>
  );
}

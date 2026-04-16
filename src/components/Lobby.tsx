"use client";
import { useState } from "react";
import type { Room, Player } from "@/app/room/[code]/RoomClient";
import { getQuizMeta } from "@/lib/quizMeta";
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
  const meta = getQuizMeta(quizId);

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
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Room code header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-3">
            <span className="text-xs text-neutral-500 uppercase tracking-wider">Room</span>
            <span className="text-3xl font-mono font-bold tracking-[0.25em]">{room.code}</span>
          </div>
          <p className="text-sm text-neutral-500">Share this code with friends to join</p>
        </div>

        {/* Quiz info */}
        {meta && (
          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${meta.color}15` }}
            >
              <span className="text-2xl">{meta.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">{meta.label}</h2>
              <p className="text-xs text-neutral-500">{meta.itemCount} items</p>
            </div>
          </div>
        )}

        {/* Players */}
        <section>
          <h2 className="text-xs uppercase text-neutral-500 mb-2 px-1">Players ({players.length}/6)</h2>
          <PlayerBadges players={players} meId={meId} />
        </section>

        {/* Host controls */}
        {isHost && (
          <section className="space-y-3 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <h3 className="text-xs uppercase text-neutral-500">Host settings</h3>
            <select
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2"
            >
              {quizzes.map((q) => <option key={q.id} value={q.id}>{q.label}</option>)}
            </select>
            <div className="flex gap-2 flex-wrap">
              {TIME_OPTS.map((o) => (
                <button
                  key={String(o.value)}
                  onClick={() => setTimeLimit(o.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    timeLimit === o.value
                      ? "bg-emerald-500 text-black font-semibold"
                      : "bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >{o.label}</button>
              ))}
            </div>
          </section>
        )}

        {/* Start */}
        {isHost ? (
          <button
            onClick={start}
            disabled={busy || players.length < 2}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl disabled:opacity-50 transition-colors text-lg"
          >
            {players.length < 2 ? "Waiting for players…" : "Start Game"}
          </button>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-neutral-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Waiting for host to start…
            </div>
          </div>
        )}

        {err && <p className="text-red-400 text-sm text-center">{err}</p>}
      </div>
    </main>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Room, Player, Claim } from "@/app/room/[code]/RoomClient";
import type { Quiz } from "@/lib/quizzes";
import PlayerBadges from "./PlayerBadges";

export default function Results({
  room, players, claims, quiz, isHost, meId,
}: { room: Room; players: Player[]; claims: Claim[]; quiz: Quiz; isHost: boolean; meId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const winner = [...players].sort((a, b) => b.score - a.score)[0];
  const missed = quiz.items.filter((it) => !claims.some((c) => c.item_id === it.id));

  async function rematch() {
    setBusy(true);
    try {
      await fetch(`/api/rooms/${room.code}/rematch`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ player_id: meId }),
      });
    } finally { setBusy(false); }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Game Over</h1>
        {winner && (
          <p className="text-lg">
            <span style={{ color: winner.color }} className="font-semibold">{winner.nickname}</span> wins
            with <span className="font-bold">{winner.score}</span> points
          </p>
        )}
        <p className="text-sm text-neutral-500">{claims.length} / {quiz.items.length} claimed</p>
      </header>

      <section>
        <h2 className="text-xs uppercase text-neutral-500 mb-2">Final Scores</h2>
        <PlayerBadges players={players} meId={meId} />
      </section>

      {missed.length > 0 && (
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <h2 className="text-xs uppercase text-neutral-500 mb-3">Missed ({missed.length})</h2>
          <ul className="flex flex-wrap gap-1.5">
            {missed.map((it) => (
              <li key={it.id} className="text-xs bg-neutral-800 rounded-lg px-2.5 py-1 text-neutral-400">
                {it.answer}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex gap-3">
        {isHost ? (
          <button
            onClick={rematch}
            disabled={busy}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            Rematch
          </button>
        ) : (
          <div className="flex-1 py-3 text-center text-neutral-500">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Waiting for host…
            </span>
          </div>
        )}
        <button
          onClick={() => router.push("/")}
          className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl transition-colors"
        >
          Browse Quizzes
        </button>
      </div>
    </main>
  );
}

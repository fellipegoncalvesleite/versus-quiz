"use client";
import { useState } from "react";
import type { Room, Player, Claim } from "@/app/room/[code]/RoomClient";
import type { Quiz } from "@/lib/quizzes";
import PlayerBadges from "./PlayerBadges";

export default function Results({
  room, players, claims, quiz, isHost, meId,
}: { room: Room; players: Player[]; claims: Claim[]; quiz: Quiz; isHost: boolean; meId: string }) {
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
    <main className="min-h-screen p-6 max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Game over</h1>
        {winner && (
          <p className="mt-1">
            Winner: <span style={{ color: winner.color }} className="font-semibold">{winner.nickname}</span> with {winner.score}
          </p>
        )}
      </header>

      <section>
        <h2 className="text-sm uppercase text-neutral-500 mb-2">Final scores</h2>
        <PlayerBadges players={players} meId={meId} />
      </section>

      {missed.length > 0 && (
        <section>
          <h2 className="text-sm uppercase text-neutral-500 mb-2">Missed ({missed.length})</h2>
          <ul className="flex flex-wrap gap-1.5">
            {missed.map((it) => (
              <li key={it.id} className="text-xs bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-400">
                {it.answer}
              </li>
            ))}
          </ul>
        </section>
      )}

      {isHost ? (
        <button
          onClick={rematch}
          disabled={busy}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded disabled:opacity-50"
        >
          Rematch
        </button>
      ) : (
        <p className="text-center text-neutral-500">Waiting for host…</p>
      )}
    </main>
  );
}

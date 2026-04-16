"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Room, Player, Session, Claim } from "@/app/room/[code]/RoomClient";
import type { Quiz } from "@/lib/quizzes";
import { matchAnswer } from "@/lib/quizzes";
import PlayerBadges from "./PlayerBadges";
import ClaimFeed from "./ClaimFeed";
import MapBoard from "./MapBoard";
import ListBoard from "./ListBoard";

export default function Game({
  room, players, session, claims, quiz, meId,
}: {
  room: Room; players: Player[]; session: Session; claims: Claim[]; quiz: Quiz; meId: string;
}) {
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSubmitted = useRef<string>("");
  const endedRef = useRef(false);

  const claimedIds = useMemo(() => new Set(claims.map((c) => c.item_id)), [claims]);
  const playerById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

  // Keep input focused.
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const onClick = () => inputRef.current?.focus();
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Timer + auto-end.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);
  const endsAtMs = session.ends_at ? new Date(session.ends_at).getTime() : null;
  const remaining = endsAtMs ? Math.max(0, Math.ceil((endsAtMs - now) / 1000)) : null;

  useEffect(() => {
    if (endedRef.current) return;
    const allClaimed = claims.length >= quiz.items.length;
    const timeUp = remaining === 0;
    if (allClaimed || timeUp) {
      endedRef.current = true;
      fetch(`/api/rooms/${room.code}/end`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ session_id: session.id }),
      }).catch(() => {});
    }
  }, [claims.length, quiz.items.length, remaining, room.code, session.id]);

  // Debounced claim attempts: fires ~120ms after last keystroke if input has an exact match locally.
  useEffect(() => {
    const value = input.trim();
    if (!value) return;
    const localMatch = matchAnswer(quiz.id, value);
    if (!localMatch) return;
    if (claimedIds.has(localMatch)) return;
    if (lastSubmitted.current === value) return;

    const t = setTimeout(async () => {
      lastSubmitted.current = value;
      try {
        const res = await fetch(`/api/rooms/${room.code}/claim`, {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ player_id: meId, session_id: session.id, input: value }),
        });
        const data = await res.json();
        if (data.claimed) {
          setInput(""); setFlash("ok"); setTimeout(() => setFlash(null), 200);
        } else if (data.locked || data.invalid) {
          setFlash("bad"); setTimeout(() => setFlash(null), 150);
        }
      } catch { /* network burp - ignore */ }
    }, 80);

    return () => clearTimeout(t);
  }, [input, quiz.id, claimedIds, room.code, meId, session.id]);

  const itemClaimerColor = (itemId: string): string | null => {
    const c = claims.find((x) => x.item_id === itemId);
    if (!c) return null;
    return playerById.get(c.player_id)?.color ?? "#888";
  };

  const progress = `${claims.length} / ${quiz.items.length}`;

  return (
    <main className="min-h-screen p-4 grid gap-4 lg:grid-cols-[1fr_280px] max-w-[1400px] mx-auto">
      <section className="space-y-3">
        <header className="flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-bold">{quiz.label}</h1>
            <p className="text-xs text-neutral-500">{quiz.prompt}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500">Progress</div>
            <div className="tabular-nums font-mono text-lg">{progress}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500">Time</div>
            <div className="tabular-nums font-mono text-lg">{remaining === null ? "∞" : formatTime(remaining)}</div>
          </div>
        </header>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type an answer…"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          className={`w-full bg-neutral-900 border-2 rounded-lg px-4 py-3 text-lg outline-none transition-colors ${
            flash === "ok" ? "border-emerald-500" : flash === "bad" ? "border-red-500" : "border-neutral-800 focus:border-neutral-500"
          }`}
        />

        {quiz.kind === "map" ? (
          <MapBoard quiz={quiz} colorOf={itemClaimerColor} />
        ) : (
          <ListBoard quiz={quiz} colorOf={itemClaimerColor} />
        )}
      </section>

      <aside className="space-y-4">
        <section>
          <h2 className="text-xs uppercase text-neutral-500 mb-2">Scoreboard</h2>
          <PlayerBadges players={players} meId={meId} />
        </section>
        <section>
          <h2 className="text-xs uppercase text-neutral-500 mb-2">Recent claims</h2>
          <ClaimFeed claims={claims} players={players} quiz={quiz} />
        </section>
      </aside>
    </main>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

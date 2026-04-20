"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getQuiz, matchAnswer } from "@/lib/quizzes";
import { getQuizMeta } from "@/lib/quizMeta";
import type { BoardOwnership } from "./BoardPrimitives";

const PLAYER_COLOR = "#22c55e";
const MapBoard = dynamic(() => import("./MapBoard"), { loading: BoardLoading });
const ListBoard = dynamic(() => import("./ListBoard"), { loading: BoardLoading });

export default function SoloGame({ quizId, timeLimit }: { quizId: string; timeLimit: number | null }) {
  const router = useRouter();
  const quiz = getQuiz(quizId);
  const meta = getQuizMeta(quizId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [startedAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const [recentClaims, setRecentClaims] = useState<string[]>([]);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const elapsed = Math.floor((now - startedAt) / 1000);
  const remaining = timeLimit ? Math.max(0, timeLimit - elapsed) : null;

  const finishGame = useCallback(() => setFinished(true), []);

  useEffect(() => {
    if (finished) return;
    if (remaining === 0) finishGame();
    if (quiz && claimed.size >= quiz.items.length) finishGame();
  }, [remaining, claimed.size, quiz, finished, finishGame]);

  useEffect(() => {
    if (!quiz || finished) return;
    const value = input.trim();
    if (!value) return;
    const itemId = matchAnswer(quiz.id, value);
    if (!itemId || claimed.has(itemId)) return;
    const t = setTimeout(() => {
      setClaimed((prev) => new Set(prev).add(itemId));
      const item = quiz.items.find((x) => x.id === itemId);
      if (item) setRecentClaims((prev) => [item.answer, ...prev].slice(0, 6));
      setInput("");
      setFlash("ok");
      setTimeout(() => setFlash(null), 200);
    }, 60);
    return () => clearTimeout(t);
  }, [input, quiz, claimed, finished]);

  if (!quiz || !meta) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center text-neutral-500">
        Quiz not found.
      </main>
    );
  }

  const ownershipOf = (itemId: string): BoardOwnership => (
    claimed.has(itemId)
      ? { color: PLAYER_COLOR, name: "You" }
      : null
  );

  if (finished) {
    const missed = quiz.items.filter((it) => !claimed.has(it.id));
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Game over</h1>
          <p className="text-neutral-400 mt-1">
            You got <span className="text-emerald-400 font-semibold">{claimed.size}</span> / {quiz.items.length}
            {timeLimit ? ` in ${formatTime(timeLimit)}` : ` in ${formatTime(elapsed)}`}
          </p>
        </header>
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
        <div className="flex gap-3">
          <button
            onClick={() => { setClaimed(new Set()); setFinished(false); setInput(""); setRecentClaims([]); }}
            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg"
          >
            Play again
          </button>
          <button
            onClick={() => router.push(`/quiz/${quizId}`)}
            className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg"
          >
            Back to quiz
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] p-4 grid gap-4 max-w-[1400px] mx-auto lg:h-[calc(100vh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_260px] lg:overflow-hidden">
      <section className="flex min-h-0 flex-col gap-3">
        <header className="flex items-baseline justify-between flex-wrap gap-2 shrink-0">
          <div>
            <h1 className="text-xl font-bold">{meta.label}</h1>
            <p className="text-xs text-neutral-500">{quiz.prompt}</p>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <div className="text-xs text-neutral-500">Progress</div>
              <div className="tabular-nums font-mono text-lg">{claimed.size} / {quiz.items.length}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-neutral-500">Time</div>
              <div className="tabular-nums font-mono text-lg">
                {remaining !== null ? formatTime(remaining) : formatTime(elapsed)}
              </div>
            </div>
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
        <div className="min-h-0 lg:flex-1 lg:overflow-auto lg:pr-1">
          {quiz.kind === "map" ? (
            <MapBoard quiz={quiz} ownershipOf={ownershipOf} />
          ) : (
            <ListBoard quiz={quiz} ownershipOf={ownershipOf} />
          )}
        </div>
      </section>

      <aside className="space-y-4 lg:min-h-0 lg:overflow-auto lg:pr-1">
        <section>
          <h2 className="text-xs uppercase text-neutral-500 mb-2">Recent</h2>
          {recentClaims.length === 0 ? (
            <p className="text-xs text-neutral-600">No answers yet.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {recentClaims.map((a, i) => (
                <li key={i} className="text-emerald-400">{a}</li>
              ))}
            </ul>
          )}
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

function BoardLoading() {
  return (
    <section className="min-h-[320px] rounded-xl border border-neutral-800 bg-neutral-900 flex items-center justify-center text-neutral-500">
      Loading board…
    </section>
  );
}

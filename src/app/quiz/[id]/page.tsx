"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getQuizMeta } from "@/lib/quizMeta";
import Link from "next/link";

const TIME_OPTS: { label: string; value: number | null }[] = [
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
  { label: "Untimed", value: null },
];

export default function QuizDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const quiz = getQuizMeta(id);

  const [nickname, setNickname] = useState("");
  const [timeLimit, setTimeLimit] = useState<number | null>(300);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!quiz) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">Quiz not found.</p>
        <Link href="/" className="text-emerald-400 hover:underline">Back to home</Link>
      </main>
    );
  }

  async function createRoom() {
    if (!nickname.trim()) { setError("Enter a nickname"); return; }
    setError(null); setBusy(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nickname, quiz_id: quiz!.id, time_limit_seconds: timeLimit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
      localStorage.setItem(`vq:${data.code}`, JSON.stringify({ roomId: data.room_id, playerId: data.player_id }));
      router.push(`/room/${data.code}`);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Quiz header */}
      <div className="flex items-start gap-5">
        <div
          className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${quiz.color}20, ${quiz.color}10)` }}
        >
          <span className="text-4xl">{quiz.icon}</span>
        </div>
        <div>
          <div className="flex gap-2 mb-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: `${quiz.color}25`, color: quiz.color }}
            >
              {quiz.category}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
              {quiz.kind === "map" ? "Map mode" : "List mode"}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{quiz.label}</h1>
          <p className="text-neutral-400 mt-1">{quiz.description}</p>
          <p className="text-sm text-neutral-600 mt-1">{quiz.itemCount} items to claim</p>
        </div>
      </div>

      {/* Play solo */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold">Play Solo</h2>
            <p className="text-xs text-neutral-500">Practice on your own. No pressure.</p>
          </div>
        </div>
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
        <Link
          href={`/quiz/${quiz.id}/solo?time=${timeLimit ?? ""}`}
          className="block w-full text-center py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors"
        >
          Start Solo
        </Link>
      </section>

      {/* Create room */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold">Multiplayer</h2>
            <p className="text-xs text-neutral-500">Create a private room and invite friends (2–6 players).</p>
          </div>
        </div>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="Your nickname"
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 outline-none focus:border-neutral-500 transition-colors"
        />
        <button
          onClick={createRoom}
          disabled={busy}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          Create Room
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </section>
    </main>
  );
}

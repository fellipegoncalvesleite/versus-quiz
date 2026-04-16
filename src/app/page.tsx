"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { listQuizzes } from "@/lib/quizzes";

const TIME_OPTS: { label: string; value: number | null }[] = [
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
  { label: "Untimed", value: null },
];

export default function Home() {
  const router = useRouter();
  const quizzes = listQuizzes();
  const [tab, setTab] = useState<"create" | "join">("create");
  const [nickname, setNickname] = useState("");
  const [quizId, setQuizId] = useState(quizzes[0].id);
  const [timeLimit, setTimeLimit] = useState<number | null>(300);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function savePlayer(code: string, roomId: string, playerId: string) {
    localStorage.setItem(`vq:${code}`, JSON.stringify({ roomId, playerId }));
  }

  async function createRoom() {
    setError(null);
    if (!nickname.trim()) return setError("Nickname required");
    setBusy(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nickname, quiz_id: quizId, time_limit_seconds: timeLimit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
      savePlayer(data.code, data.room_id, data.player_id);
      router.push(`/room/${data.code}`);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function joinRoom() {
    setError(null);
    if (!nickname.trim()) return setError("Nickname required");
    if (!joinCode.trim()) return setError("Room code required");
    setBusy(true);
    try {
      const code = joinCode.trim().toUpperCase();
      const res = await fetch(`/api/rooms/${code}/join`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nickname }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
      savePlayer(code, data.room_id, data.player_id);
      router.push(`/room/${code}`);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Versus Quiz</h1>
          <p className="text-neutral-400 mt-1">Type faster. Claim first.</p>
        </header>

        <div className="flex gap-2">
          <button
            onClick={() => setTab("create")}
            className={`flex-1 py-2 rounded ${tab === "create" ? "bg-white text-black" : "bg-neutral-800"}`}
          >
            Create room
          </button>
          <button
            onClick={() => setTab("join")}
            className={`flex-1 py-2 rounded ${tab === "join" ? "bg-white text-black" : "bg-neutral-800"}`}
          >
            Join room
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-neutral-400">Nickname</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 outline-none focus:border-neutral-500"
            placeholder="Your name"
          />
        </div>

        {tab === "create" ? (
          <>
            <div className="space-y-2">
              <label className="block text-sm text-neutral-400">Quiz</label>
              <select
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>{q.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-neutral-400">Time limit</label>
              <div className="flex gap-2 flex-wrap">
                {TIME_OPTS.map((o) => (
                  <button
                    key={String(o.value)}
                    onClick={() => setTimeLimit(o.value)}
                    className={`px-3 py-1.5 rounded border ${timeLimit === o.value ? "bg-white text-black border-white" : "border-neutral-700"}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={createRoom}
              disabled={busy}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded disabled:opacity-50"
            >
              Create room
            </button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="block text-sm text-neutral-400">Room code</label>
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 tracking-widest uppercase text-center text-xl"
                placeholder="ABCD"
              />
            </div>
            <button
              onClick={joinRoom}
              disabled={busy}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded disabled:opacity-50"
            >
              Join room
            </button>
          </>
        )}

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>
    </main>
  );
}

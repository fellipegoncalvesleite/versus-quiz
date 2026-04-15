"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JoinPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function joinRoom() {
    setError(null);
    if (!nickname.trim()) return setError("Enter a nickname");
    if (!joinCode.trim()) return setError("Enter a room code");
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
      localStorage.setItem(`vq:${code}`, JSON.stringify({ roomId: data.room_id, playerId: data.player_id }));
      router.push(`/room/${code}`);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Join a Room</h1>
          <p className="text-sm text-neutral-500 mt-1">Enter the code from the host</p>
        </div>

        <div className="space-y-3">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            placeholder="Your nickname"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 outline-none focus:border-neutral-500 transition-colors"
          />
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="ROOM CODE"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 outline-none focus:border-neutral-500 transition-colors tracking-widest uppercase text-center text-xl font-mono"
          />
        </div>

        <button
          onClick={joinRoom}
          disabled={busy}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          Join Room
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <p className="text-center">
          <Link href="/" className="text-sm text-neutral-500 hover:text-white transition-colors">
            or browse quizzes
          </Link>
        </p>
      </div>
    </main>
  );
}

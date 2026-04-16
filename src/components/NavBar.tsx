"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const path = usePathname();
  const isGame = path.startsWith("/room/") || path.startsWith("/quiz/") && path.includes("/play");
  if (isGame) return null;

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-neutral-800/50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:text-white transition-colors">
          <span className="bg-emerald-500 text-black text-xs font-bold px-1.5 py-0.5 rounded">VS</span>
          Versus Quiz
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/join"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Join Room
          </Link>
        </div>
      </div>
    </nav>
  );
}

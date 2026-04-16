import type { Player } from "@/app/room/[code]/RoomClient";

export default function PlayerBadges({ players, meId }: { players: Player[]; meId: string }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  return (
    <ul className="space-y-1.5">
      {sorted.map((p, i) => (
        <li
          key={p.id}
          className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5"
        >
          <span className="flex items-center gap-3">
            <span className="text-xs text-neutral-600 w-4 text-right tabular-nums">{i + 1}</span>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: `${p.color}20`, color: p.color }}
            >
              {p.nickname.charAt(0).toUpperCase()}
            </span>
            <span className="font-medium" style={{ color: p.color }}>{p.nickname}</span>
            {p.id === meId && <span className="text-[10px] bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded-full">you</span>}
          </span>
          <span className="tabular-nums font-bold text-lg">{p.score}</span>
        </li>
      ))}
    </ul>
  );
}

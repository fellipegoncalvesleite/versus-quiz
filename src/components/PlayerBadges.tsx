import type { Player } from "@/app/room/[code]/RoomClient";

export default function PlayerBadges({ players, meId }: { players: Player[]; meId: string }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  return (
    <ul className="space-y-1.5">
      {sorted.map((p) => (
        <li key={p.id} className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded px-3 py-2">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
            <span style={{ color: p.color }}>{p.nickname}</span>
            {p.id === meId && <span className="text-xs text-neutral-500">(you)</span>}
          </span>
          <span className="tabular-nums font-semibold">{p.score}</span>
        </li>
      ))}
    </ul>
  );
}

import type { Claim, Player } from "@/app/room/[code]/RoomClient";
import type { Quiz } from "@/lib/quizzes";

export default function ClaimFeed({ claims, players, quiz }: { claims: Claim[]; players: Player[]; quiz: Quiz }) {
  const playerById = new Map(players.map((p) => [p.id, p]));
  const itemById = new Map(quiz.items.map((it) => [it.id, it]));
  const recent = [...claims].sort((a, b) => b.claimed_at.localeCompare(a.claimed_at)).slice(0, 8);
  if (!recent.length) return <p className="text-xs text-neutral-600">No claims yet.</p>;
  return (
    <ul className="space-y-1 text-sm">
      {recent.map((c) => {
        const player = playerById.get(c.player_id);
        const item = itemById.get(c.item_id);
        return (
          <li key={c.id} className="flex gap-2">
            <span style={{ color: player?.color ?? "#888" }}>{player?.nickname ?? "?"}</span>
            <span className="text-neutral-500">→</span>
            <span>{item?.answer ?? c.item_id}</span>
          </li>
        );
      })}
    </ul>
  );
}

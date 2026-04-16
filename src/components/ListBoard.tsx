import type { Quiz } from "@/lib/quizzes";
import { UCL_FINALS } from "@/lib/boardData";
import { maskLabel, OwnershipBadge, type BoardOwnership } from "./BoardPrimitives";

export default function ListBoard({
  quiz,
  ownershipOf,
}: {
  quiz: Quiz;
  ownershipOf: (itemId: string) => BoardOwnership;
}) {
  if (quiz.id === "us_universities") {
    return <RankingBoard quiz={quiz} ownershipOf={ownershipOf} />;
  }

  if (quiz.id === "ucl_winners") {
    return <ChampionsLeagueBoard quiz={quiz} ownershipOf={ownershipOf} />;
  }

  return <GenericListBoard quiz={quiz} ownershipOf={ownershipOf} />;
}

function RankingBoard({
  quiz,
  ownershipOf,
}: {
  quiz: Quiz;
  ownershipOf: (itemId: string) => BoardOwnership;
}) {
  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <header className="border-b border-neutral-800 px-4 py-3">
        <h2 className="text-xs uppercase tracking-wider text-neutral-500">Ranking Board</h2>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Rank</th>
              <th className="px-4 py-2.5 font-medium">College</th>
              <th className="px-4 py-2.5 font-medium">Claimed by</th>
            </tr>
          </thead>
          <tbody>
            {quiz.items.map((item, index) => {
              const ownership = ownershipOf(item.id);
              return (
                <tr key={item.id} className="border-t border-neutral-800">
                  <td className="px-4 py-3 font-mono text-neutral-500">{index + 1}</td>
                  <td
                    className={`px-4 py-3 ${ownership ? "font-medium" : "text-neutral-600"}`}
                    style={ownership ? { color: ownership.color } : undefined}
                  >
                    {ownership ? item.answer : maskLabel(item.answer)}
                  </td>
                  <td className="px-4 py-3">
                    <OwnershipBadge ownership={ownership} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChampionsLeagueBoard({
  quiz,
  ownershipOf,
}: {
  quiz: Quiz;
  ownershipOf: (itemId: string) => BoardOwnership;
}) {
  const clubById = new Map(quiz.items.map((item) => [item.id, item]));

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <header className="border-b border-neutral-800 px-4 py-3">
        <h2 className="text-xs uppercase tracking-wider text-neutral-500">Champions League Finals</h2>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Season</th>
              <th className="px-4 py-2.5 font-medium">Winner</th>
              <th className="px-4 py-2.5 font-medium">Runner-up</th>
              <th className="px-4 py-2.5 font-medium">Score</th>
              <th className="px-4 py-2.5 font-medium">Claimed by</th>
            </tr>
          </thead>
          <tbody>
            {UCL_FINALS.map((final) => {
              const club = clubById.get(final.winnerId);
              const ownership = club ? ownershipOf(club.id) : null;
              const winnerLabel = club?.answer ?? final.winnerId;

              return (
                <tr key={final.season} className="border-t border-neutral-800">
                  <td className="px-4 py-3 font-mono text-neutral-500">{compactSeason(final.season)}</td>
                  <td
                    className={`px-4 py-3 ${ownership ? "font-medium" : "text-neutral-600"}`}
                    style={ownership ? { color: ownership.color } : undefined}
                  >
                    {ownership ? winnerLabel : maskLabel(winnerLabel)}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{final.runnerUp}</td>
                  <td className="px-4 py-3 font-mono text-neutral-500">{final.score}</td>
                  <td className="px-4 py-3">
                    <OwnershipBadge ownership={ownership} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function GenericListBoard({
  quiz,
  ownershipOf,
}: {
  quiz: Quiz;
  ownershipOf: (itemId: string) => BoardOwnership;
}) {
  return (
    <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
      {quiz.items.map((item) => {
        const ownership = ownershipOf(item.id);
        return (
          <li key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 space-y-2">
            <div
              className={`truncate text-sm ${ownership ? "font-medium" : "text-neutral-600"}`}
              style={ownership ? { color: ownership.color } : undefined}
            >
              {ownership ? item.answer : maskLabel(item.answer)}
            </div>
            <OwnershipBadge ownership={ownership} />
          </li>
        );
      })}
    </ul>
  );
}

function compactSeason(season: string): string {
  const [start, end] = season.split("-");
  if (!start || !end || end.length < 2) return season;
  return `${start.slice(-2)}-${end.slice(-2)}`;
}

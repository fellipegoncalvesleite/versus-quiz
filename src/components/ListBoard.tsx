import type { Quiz } from "@/lib/quizzes";
import {
  BRASILEIRAO_FINALS,
  COPA_DO_BRASIL_FINALS,
  getUclFinalistId,
  type SeasonHistoryRow,
  UCL_FINALS,
} from "@/lib/boardData";
import { maskLabel, type BoardOwnership } from "./BoardPrimitives";

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

  const historyRows = getHistoryRows(quiz.id);
  if (historyRows) {
    return <SeasonHistoryBoard quiz={quiz} rows={historyRows} ownershipOf={ownershipOf} />;
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
  const columns = splitIntoColumns(quiz.items, 2);

  return (
    <section className="space-y-3">
      <header className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
        <h2 className="text-xs uppercase tracking-wider text-neutral-500">Ranking Board</h2>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Rank</th>
                  <th className="px-4 py-2.5 font-medium">College</th>
                </tr>
              </thead>
              <tbody>
                {column.map((item, rowIndex) => {
                  const ownership = ownershipOf(item.id);
                  const rank = columns.slice(0, columnIndex).reduce((sum, current) => sum + current.length, 0) + rowIndex + 1;

                  return (
                    <tr key={item.id} className="border-t border-neutral-800">
                      <td className="px-4 py-3 font-mono text-neutral-500">{rank}</td>
                      <ClaimTableCell ownership={ownership} label={item.answer} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}

function SeasonHistoryBoard({
  quiz,
  rows,
  ownershipOf,
}: {
  quiz: Quiz;
  rows: SeasonHistoryRow[];
  ownershipOf: (itemId: string) => BoardOwnership;
}) {
  const clubById = new Map(quiz.items.map((item) => [item.id, item]));
  const columnCount = rows.length > 56 ? 3 : 2;
  const columns = splitIntoColumns(rows, columnCount);
  const gridClass = columnCount === 3 ? "grid gap-4 xl:grid-cols-2 2xl:grid-cols-3" : "grid gap-4 lg:grid-cols-2";

  return (
    <section className="space-y-3">
      <header className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
        <h2 className="text-xs uppercase tracking-wider text-neutral-500">Winners & Runners-up</h2>
      </header>
      <div className={gridClass}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Season</th>
                  <th className="px-4 py-2.5 font-medium">Winner</th>
                  <th className="px-4 py-2.5 font-medium">Runner-up</th>
                </tr>
              </thead>
              <tbody>
                {column.map((final) => {
                  const winner = clubById.get(final.winnerId);
                  const winnerOwnership = winner ? ownershipOf(winner.id) : null;
                  const runnerUpId = final.runnerUpId ?? getUclFinalistId(final.runnerUp);
                  const runnerUp = runnerUpId ? clubById.get(runnerUpId) : null;
                  const runnerUpOwnership = runnerUp ? ownershipOf(runnerUp.id) : null;

                  return (
                    <tr key={`${columnIndex}-${final.season}`} className="border-t border-neutral-800 align-top">
                      <td className="px-4 py-3">
                        <div className="font-mono text-neutral-400">{formatSeasonLabel(final.season)}</div>
                        {final.score ? <div className="text-[11px] text-neutral-600">{final.score}</div> : null}
                      </td>
                      <ClaimTableCell ownership={winnerOwnership} label={winner?.answer ?? final.winnerId} />
                      <ClaimTableCell ownership={runnerUpOwnership} label={runnerUp?.answer ?? final.runnerUp} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
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
          </li>
        );
      })}
    </ul>
  );
}

function getHistoryRows(quizId: string): SeasonHistoryRow[] | null {
  if (quizId === "ucl_winners") return UCL_FINALS;
  if (quizId === "brasileirao_finalists") return BRASILEIRAO_FINALS;
  if (quizId === "copa_do_brasil_finalists") return COPA_DO_BRASIL_FINALS;
  return null;
}

function formatSeasonLabel(season: string): string {
  if (/^\d{4}-\d{2}$/.test(season)) {
    const [start, end] = season.split("-");
    return `${start.slice(-2)}-${end.slice(-2)}`;
  }
  if (/^\d{4}-[A-Z]$/.test(season)) {
    return season.replace("-", " ");
  }
  return season;
}

function splitIntoColumns<T>(items: T[], count: number): T[][] {
  const size = Math.ceil(items.length / count);
  return Array.from({ length: count }, (_, index) => items.slice(index * size, (index + 1) * size)).filter((column) => column.length > 0);
}

function ClaimTableCell({
  ownership,
  label,
}: {
  ownership: BoardOwnership;
  label: string;
}) {
  return (
    <td
      className={`px-4 py-3 ${ownership ? "font-medium" : "text-neutral-600"}`}
      style={
        ownership
          ? {
              color: ownership.color,
              backgroundColor: `${ownership.color}12`,
            }
          : undefined
      }
    >
      {ownership ? label : maskLabel(label)}
    </td>
  );
}

import brazilMap from "@svg-maps/brazil";
import usaMap from "@svg-maps/usa";
import worldMap from "@svg-maps/world";
import type { Quiz, QuizItem } from "@/lib/quizzes";
import {
  BRAZIL_STATE_GROUPS,
  getBrazilStateName,
  getCountryName,
  US_STATE_GROUPS,
  WORLD_COUNTRY_GROUPS,
} from "@/lib/boardData";
import { maskLabel, OwnershipBadge, type BoardOwnership } from "./BoardPrimitives";

type SvgLocation = {
  id: string;
  name: string;
  path: string;
};

type SvgMap = {
  label: string;
  viewBox: string;
  locations: SvgLocation[];
};

export default function MapBoard({
  quiz,
  ownershipOf,
}: {
  quiz: Quiz;
  ownershipOf: (itemId: string) => BoardOwnership;
}) {
  const itemByMapId = new Map(quiz.items.map((item) => [item.id.toLowerCase(), item]));
  const itemByUpperId = new Map(quiz.items.map((item) => [item.id.toUpperCase(), item]));

  if (quiz.id === "world_countries") {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.9fr)] xl:items-start">
        <SvgMapPanel
          map={worldMap as SvgMap}
          itemByMapId={itemByMapId}
          ownershipOf={ownershipOf}
          subtitle="Claim countries directly on the world map. Claimed countries lock in the winner's color."
        />
        <GroupedClaimBoard
          title="Countries by Continent"
          groups={WORLD_COUNTRY_GROUPS}
          itemById={itemByUpperId}
          ownershipOf={ownershipOf}
        />
      </div>
    );
  }

  if (quiz.id === "us_states") {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.9fr)] xl:items-start">
        <SvgMapPanel
          map={usaMap as SvgMap}
          itemByMapId={itemByMapId}
          ownershipOf={ownershipOf}
          subtitle="Every state can be claimed once. Locked states stay filled with the claiming player's color."
        />
        <GroupedClaimBoard
          title="States by Region"
          groups={US_STATE_GROUPS}
          itemById={itemByUpperId}
          ownershipOf={ownershipOf}
        />
      </div>
    );
  }

  if (quiz.id === "brazil_states") {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.9fr)] xl:items-start">
        <SvgMapPanel
          map={brazilMap as SvgMap}
          itemByMapId={itemByMapId}
          ownershipOf={ownershipOf}
          subtitle="Claim every Brazilian state directly on the map. Locked states stay in the claiming player's color."
        />
        <GroupedClaimBoard
          title="States by Region"
          groups={BRAZIL_STATE_GROUPS}
          itemById={itemByUpperId}
          ownershipOf={ownershipOf}
        />
      </div>
    );
  }

  if (quiz.id === "world_capitals") {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.9fr)] xl:items-start">
        <SvgMapPanel
          map={worldMap as SvgMap}
          itemByMapId={itemByMapId}
          ownershipOf={ownershipOf}
          subtitle="Typing a capital colors its country on the map. The table keeps country and capital paired together."
        />
        <RelationshipBoard
          title="Countries and Capitals"
          items={quiz.items}
          ownershipOf={ownershipOf}
          entityLabel="Country"
          answerLabel="Capital"
          labelForId={getCountryName}
        />
      </div>
    );
  }

  if (quiz.id === "brazil_state_capitals") {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.9fr)] xl:items-start">
        <SvgMapPanel
          map={brazilMap as SvgMap}
          itemByMapId={itemByMapId}
          ownershipOf={ownershipOf}
          subtitle="Typing a capital colors its state on the map. The table below keeps each state paired with its capital."
        />
        <RelationshipBoard
          title="States and Capitals"
          items={quiz.items}
          ownershipOf={ownershipOf}
          entityLabel="State"
          answerLabel="Capital"
          labelForId={getBrazilStateName}
        />
      </div>
    );
  }

  return (
    <SvgMapPanel
      map={worldMap as SvgMap}
      itemByMapId={itemByMapId}
      ownershipOf={ownershipOf}
      subtitle="Claim answers to lock the matching regions on the board."
    />
  );
}

function SvgMapPanel({
  map,
  itemByMapId,
  ownershipOf,
  subtitle,
}: {
  map: SvgMap;
  itemByMapId: Map<string, QuizItem>;
  ownershipOf: (itemId: string) => BoardOwnership;
  subtitle: string;
}) {
  const seaColor = "#0a1320";
  const landFill = "#24272c";
  const landStroke = "#676d77";

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 sm:p-4 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xs uppercase tracking-wider text-neutral-500">Map Board</h2>
          <p className="text-sm text-neutral-400">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-neutral-500">
          <LegendSwatch color={landFill} border={landStroke} label="Land" />
          <LegendSwatch color={seaColor} border="#334155" label="Sea" />
          <LegendSwatch color="#22c55e" border="#22c55e" label="Claimed" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg" style={{ backgroundColor: seaColor }}>
        <svg
          viewBox={map.viewBox}
          className="min-w-[720px] w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {map.locations.map((location) => {
            const item = itemByMapId.get(location.id.toLowerCase());
            const ownership = item ? ownershipOf(item.id) : null;
            const fill = ownership?.color ?? landFill;
            const stroke = ownership?.color ?? landStroke;

            return (
              <path
                key={location.id}
                d={location.path}
                fill={fill}
                stroke={stroke}
                strokeWidth={0.8}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      </div>

      <p className="text-[11px] text-neutral-600">Map outlines based on svg-maps geometry.</p>
    </section>
  );
}

function GroupedClaimBoard({
  title,
  groups,
  itemById,
  ownershipOf,
}: {
  title: string;
  groups: Array<{ label: string; itemIds: string[] }>;
  itemById: Map<string, QuizItem>;
  ownershipOf: (itemId: string) => BoardOwnership;
}) {
  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-xs uppercase tracking-wider text-neutral-500">{title}</h2>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => {
          const items = group.itemIds
            .map((id) => itemById.get(id))
            .filter((item): item is QuizItem => Boolean(item))
            .sort((a, b) => a.answer.localeCompare(b.answer));
          const claimedCount = items.filter((item) => ownershipOf(item.id)).length;

          return (
            <section key={group.label} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <header className="flex items-center justify-between border-b border-neutral-800 px-3 py-2.5">
                <h3 className="text-sm font-semibold">{group.label}</h3>
                <span className="text-[11px] font-mono text-neutral-500">
                  {claimedCount}/{items.length}
                </span>
              </header>
              <ul className="divide-y divide-neutral-800">
                {items.map((item) => {
                  const ownership = ownershipOf(item.id);
                  return (
                    <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                      <span
                        className={`min-w-0 truncate ${ownership ? "font-medium" : "text-neutral-600"}`}
                        style={ownership ? { color: ownership.color } : undefined}
                      >
                        {ownership ? item.answer : maskLabel(item.answer)}
                      </span>
                      <OwnershipBadge ownership={ownership} />
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function RelationshipBoard({
  title,
  items,
  ownershipOf,
  entityLabel,
  answerLabel,
  labelForId,
}: {
  title: string;
  items: QuizItem[];
  ownershipOf: (itemId: string) => BoardOwnership;
  entityLabel: string;
  answerLabel: string;
  labelForId: (id: string) => string;
}) {
  const rows = [...items].sort((a, b) => labelForId(a.id).localeCompare(labelForId(b.id)));

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <header className="border-b border-neutral-800 px-4 py-3">
        <h2 className="text-xs uppercase tracking-wider text-neutral-500">{title}</h2>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">{entityLabel}</th>
              <th className="px-4 py-2.5 font-medium">{answerLabel}</th>
              <th className="px-4 py-2.5 font-medium">Claimed by</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const ownership = ownershipOf(item.id);
              return (
                <tr key={item.id} className="border-t border-neutral-800">
                  <td className="px-4 py-3 text-neutral-300">{labelForId(item.id)}</td>
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

function LegendSwatch({
  color,
  border,
  label,
}: {
  color: string;
  border: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-3.5 w-3.5 rounded-sm border" style={{ backgroundColor: color, borderColor: border }} />
      <span>{label}</span>
    </span>
  );
}

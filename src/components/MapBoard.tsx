import type { Quiz } from "@/lib/quizzes";

/**
 * MVP placeholder map: a responsive SVG grid of region tiles.
 * Each tile shows the region code (hint) and fills with player color when claimed.
 * Drop in real GeoJSON/TopoJSON later — keep the colorOf(region) API.
 */
export default function MapBoard({ quiz, colorOf }: { quiz: Quiz; colorOf: (itemId: string) => string | null }) {
  const cols = quiz.items.length > 40 ? 10 : 8;
  const rows = Math.ceil(quiz.items.length / cols);
  const tileW = 44; const tileH = 36; const gap = 4;
  const w = cols * (tileW + gap); const h = rows * (tileH + gap);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded p-3 overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {quiz.items.map((it, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = col * (tileW + gap);
          const y = row * (tileH + gap);
          const color = colorOf(it.id);
          return (
            <g key={it.id} transform={`translate(${x} ${y})`}>
              <rect
                width={tileW} height={tileH}
                rx={4} ry={4}
                fill={color ?? "#171717"}
                stroke={color ?? "#262626"}
                strokeWidth={1}
              />
              <text
                x={tileW / 2} y={tileH / 2 + 4}
                textAnchor="middle"
                fontSize={12}
                fontFamily="ui-monospace, monospace"
                fill={color ? "#0a0a0a" : "#525252"}
                fontWeight={color ? 700 : 400}
              >
                {it.region ?? it.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

import type { Quiz } from "@/lib/quizzes";

export default function ListBoard({ quiz, colorOf }: { quiz: Quiz; colorOf: (itemId: string) => string | null }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
      {quiz.items.map((it) => {
        const color = colorOf(it.id);
        return (
          <li
            key={it.id}
            className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-sm truncate"
            style={color ? { color, borderColor: color } : undefined}
          >
            {color ? it.answer : <span className="text-neutral-700">· · · · · ·</span>}
          </li>
        );
      })}
    </ul>
  );
}

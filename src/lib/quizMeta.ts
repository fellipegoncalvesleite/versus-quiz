export type QuizMeta = {
  id: string;
  label: string;
  description: string;
  category: string;
  kind: "map" | "list";
  itemCount: number;
  color: string;
  icon: string;
  featured: boolean;
};

export const QUIZ_META: QuizMeta[] = [
  {
    id: "world_countries",
    label: "Countries of the World",
    description: "Name every country on the planet. 112 countries to claim.",
    category: "Geography",
    kind: "map",
    itemCount: 112,
    color: "#22c55e",
    icon: "🌍",
    featured: true,
  },
  {
    id: "us_states",
    label: "US States",
    description: "Can you name all 50 US states before time runs out?",
    category: "Geography",
    kind: "map",
    itemCount: 50,
    color: "#3b82f6",
    icon: "🇺🇸",
    featured: true,
  },
  {
    id: "world_capitals",
    label: "World Capitals",
    description: "Type the capital city of every country. 66 capitals.",
    category: "Geography",
    kind: "map",
    itemCount: 66,
    color: "#eab308",
    icon: "🏛️",
    featured: true,
  },
  {
    id: "us_universities",
    label: "Famous US Universities",
    description: "From the Ivy League to state powerhouses. 40 universities.",
    category: "Education",
    kind: "list",
    itemCount: 40,
    color: "#a855f7",
    icon: "🎓",
    featured: false,
  },
  {
    id: "ucl_winners",
    label: "Champions League Winners & Runners-up",
    description: "Every club to win or finish runner-up in a European Cup / UCL final. 42 clubs.",
    category: "Sports",
    kind: "list",
    itemCount: 42,
    color: "#ef4444",
    icon: "⚽",
    featured: false,
  },
];

export const CATEGORIES = [...new Set(QUIZ_META.map((q) => q.category))];

export function getQuizMeta(id: string): QuizMeta | undefined {
  return QUIZ_META.find((q) => q.id === id);
}

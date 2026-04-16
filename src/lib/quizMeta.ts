export const QUIZ_FILTERS = [
  "All",
  "Geography",
  "History",
  "Football",
  "Education",
  "Brazil",
] as const;

export type QuizFilter = (typeof QUIZ_FILTERS)[number];
export type QuizCategory = Exclude<QuizFilter, "All">;

export type QuizMeta = {
  id: string;
  label: string;
  description: string;
  categories: QuizCategory[];
  kind: "map" | "list";
  itemCount: number;
  color: string;
  icon: string;
  thumbnail: string;
  thumbnailAlt: string;
  thumbnailFit?: "cover" | "contain";
  thumbnailPosition?: string;
  featured: boolean;
};

export const QUIZ_META: QuizMeta[] = [
  {
    id: "world_countries",
    label: "Countries of the World",
    description: "Name every country on the planet. 197 countries to claim.",
    categories: ["Geography"],
    kind: "map",
    itemCount: 197,
    color: "#22c55e",
    icon: "🌍",
    thumbnail: "/quiz-thumbnails/world-countries.jpg",
    thumbnailAlt: "Satellite view of Earth",
    thumbnailFit: "cover",
    thumbnailPosition: "center center",
    featured: true,
  },
  {
    id: "us_states",
    label: "US States",
    description: "Can you name all 50 US states before time runs out?",
    categories: ["Geography"],
    kind: "map",
    itemCount: 50,
    color: "#3b82f6",
    icon: "🇺🇸",
    thumbnail: "/quiz-thumbnails/us-states.png",
    thumbnailAlt: "Map of the United States with state borders",
    thumbnailFit: "cover",
    thumbnailPosition: "center center",
    featured: true,
  },
  {
    id: "world_capitals",
    label: "World Capitals",
    description: "Type the capital city of every country. 66 capitals.",
    categories: ["Geography"],
    kind: "map",
    itemCount: 66,
    color: "#eab308",
    icon: "🏛️",
    thumbnail: "/quiz-thumbnails/world-capitals.jpg",
    thumbnailAlt: "Modern city skyline",
    thumbnailFit: "cover",
    thumbnailPosition: "center center",
    featured: true,
  },
  {
    id: "brazil_states",
    label: "Brazilian States",
    description: "Claim all 27 states on a real Brazil map, grouped cleanly by region.",
    categories: ["Brazil", "Geography"],
    kind: "map",
    itemCount: 27,
    color: "#16a34a",
    icon: "🇧🇷",
    thumbnail: "/quiz-thumbnails/brazil-states.svg",
    thumbnailAlt: "Stylized map of Brazil with state divisions",
    thumbnailFit: "cover",
    thumbnailPosition: "center center",
    featured: true,
  },
  {
    id: "brazil_state_capitals",
    label: "Capitals of Brazilian States",
    description: "Type every Brazilian state capital and color the map as you go.",
    categories: ["Brazil", "Geography"],
    kind: "map",
    itemCount: 27,
    color: "#0ea5e9",
    icon: "🏙️",
    thumbnail: "/quiz-thumbnails/brazil-capitals.svg",
    thumbnailAlt: "Stylized skyline over a Brazil map",
    thumbnailFit: "cover",
    thumbnailPosition: "center center",
    featured: false,
  },
  {
    id: "us_universities",
    label: "Famous US Universities",
    description: "From the Ivy League to state powerhouses. 40 universities.",
    categories: ["Education"],
    kind: "list",
    itemCount: 40,
    color: "#a855f7",
    icon: "🎓",
    thumbnail: "/quiz-thumbnails/us-universities.jpg",
    thumbnailAlt: "University campus architecture",
    thumbnailFit: "cover",
    thumbnailPosition: "center center",
    featured: false,
  },
  {
    id: "ucl_winners",
    label: "Champions League Winners & Runners-up",
    description: "Every club to win or finish runner-up in a European Cup / UCL final. 42 clubs.",
    categories: ["Football", "History"],
    kind: "list",
    itemCount: 42,
    color: "#ef4444",
    icon: "⚽",
    thumbnail: "/quiz-thumbnails/ucl-winners.svg",
    thumbnailAlt: "Stylized Champions League trophy and stadium lights",
    thumbnailFit: "cover",
    thumbnailPosition: "center center",
    featured: false,
  },
  {
    id: "brasileirao_finalists",
    label: "Brasileirão Winners & Runners-up",
    description: "Every club to win or finish second in Brasileirão history. 24 clubs.",
    categories: ["Brazil", "Football", "History"],
    kind: "list",
    itemCount: 24,
    color: "#f59e0b",
    icon: "🏆",
    thumbnail: "/quiz-thumbnails/brasileirao.svg",
    thumbnailAlt: "Stylized Brasileirão trophy illustration",
    thumbnailFit: "cover",
    thumbnailPosition: "center center",
    featured: false,
  },
  {
    id: "copa_do_brasil_finalists",
    label: "Copa do Brasil Winners & Runners-up",
    description: "Every club to win or finish second in Copa do Brasil history. 24 clubs.",
    categories: ["Brazil", "Football", "History"],
    kind: "list",
    itemCount: 24,
    color: "#f97316",
    icon: "🏆",
    thumbnail: "/quiz-thumbnails/copa-do-brasil.svg",
    thumbnailAlt: "Stylized Copa do Brasil trophy illustration",
    thumbnailFit: "cover",
    thumbnailPosition: "center center",
    featured: false,
  },
];

export function getQuizMeta(id: string): QuizMeta | undefined {
  return QUIZ_META.find((q) => q.id === id);
}

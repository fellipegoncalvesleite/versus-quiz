import worldCountries from "@/data/quizzes/world_countries.json";
import usStates from "@/data/quizzes/us_states.json";
import worldCapitals from "@/data/quizzes/world_capitals.json";
import usUniversities from "@/data/quizzes/us_universities.json";
import uclWinners from "@/data/quizzes/ucl_winners.json";
import { normalize } from "./normalize";

export type QuizItem = {
  id: string;
  answer: string;
  aliases: string[];
  region?: string;
};
export type Quiz = {
  id: string;
  label: string;
  kind: "map" | "list";
  prompt: string;
  items: QuizItem[];
};

const QUIZZES: Record<string, Quiz> = {
  world_countries: worldCountries as Quiz,
  us_states: usStates as Quiz,
  world_capitals: worldCapitals as Quiz,
  us_universities: usUniversities as Quiz,
  ucl_winners: uclWinners as Quiz,
};

export function getQuiz(id: string): Quiz | null {
  return QUIZZES[id] ?? null;
}

export function listQuizzes(): { id: string; label: string; kind: Quiz["kind"] }[] {
  return Object.values(QUIZZES).map((q) => ({ id: q.id, label: q.label, kind: q.kind }));
}

/**
 * Returns the matching item id for a (normalized) input, or null if no exact match.
 * Exact match only - we never auto-claim on prefix to avoid stealing partial answers.
 */
export function matchAnswer(quizId: string, input: string): string | null {
  const quiz = getQuiz(quizId);
  if (!quiz) return null;
  const n = normalize(input);
  if (!n) return null;
  for (const item of quiz.items) {
    if (normalize(item.answer) === n) return item.id;
    for (const alias of item.aliases) {
      if (normalize(alias) === n) return item.id;
    }
  }
  return null;
}

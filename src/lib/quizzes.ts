import worldCountries from "@/data/quizzes/world_countries.json";
import usStates from "@/data/quizzes/us_states.json";
import worldCapitals from "@/data/quizzes/world_capitals.json";
import brazilStates from "@/data/quizzes/brazil_states.json";
import brazilStateCapitals from "@/data/quizzes/brazil_state_capitals.json";
import usUniversities from "@/data/quizzes/us_universities.json";
import uclWinners from "@/data/quizzes/ucl_winners.json";
import brasileiraoFinalists from "@/data/quizzes/brasileirao_finalists.json";
import copaDoBrasilFinalists from "@/data/quizzes/copa_do_brasil_finalists.json";
import { normalize } from "./normalize";

export type QuizItem = {
  id: string;
  answer: string;
  aliases: string[];
  region?: string;
  group?: string;
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
  brazil_states: brazilStates as Quiz,
  brazil_state_capitals: brazilStateCapitals as Quiz,
  us_universities: usUniversities as Quiz,
  ucl_winners: uclWinners as Quiz,
  brasileirao_finalists: brasileiraoFinalists as Quiz,
  copa_do_brasil_finalists: copaDoBrasilFinalists as Quiz,
};

const MATCH_INDEXES = new Map<string, Map<string, string>>();

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
  return getMatchIndex(quiz).get(n) ?? null;
}

function getMatchIndex(quiz: Quiz): Map<string, string> {
  const cached = MATCH_INDEXES.get(quiz.id);
  if (cached) return cached;

  const index = new Map<string, string>();
  for (const item of quiz.items) {
    addAnswer(index, item.answer, item.id);
    for (const alias of item.aliases) {
      addAnswer(index, alias, item.id);
    }
  }

  MATCH_INDEXES.set(quiz.id, index);
  return index;
}

function addAnswer(index: Map<string, string>, answer: string, itemId: string) {
  const normalized = normalize(answer);
  if (normalized && !index.has(normalized)) {
    index.set(normalized, itemId);
  }
}

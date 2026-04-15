"use client";
import Link from "next/link";
import type { QuizMeta } from "@/lib/quizMeta";

export default function QuizCard({ quiz, size = "normal" }: { quiz: QuizMeta; size?: "normal" | "large" }) {
  const isLarge = size === "large";
  return (
    <Link href={`/quiz/${quiz.id}`} className="quiz-card block group">
      <div
        className={`relative ${isLarge ? "h-48" : "h-36"} flex items-center justify-center`}
        style={{ background: `linear-gradient(135deg, ${quiz.color}15, ${quiz.color}08)` }}
      >
        <div
          className="quiz-card-glow absolute inset-0 opacity-0 transition-opacity"
          style={{ background: `radial-gradient(circle at 50% 80%, ${quiz.color}, transparent 70%)` }}
        />
        <span className={`relative ${isLarge ? "text-6xl" : "text-4xl"}`}>{quiz.icon}</span>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: `${quiz.color}25`, color: quiz.color }}
          >
            {quiz.category}
          </span>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400"
          >
            {quiz.kind === "map" ? "Map" : "List"}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="text-[11px] text-neutral-500">{quiz.itemCount} items</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className={`font-semibold ${isLarge ? "text-lg" : "text-base"} group-hover:text-white transition-colors`}>
          {quiz.label}
        </h3>
        <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{quiz.description}</p>
      </div>
    </Link>
  );
}

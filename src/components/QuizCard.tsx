"use client";
import Link from "next/link";
import Image from "next/image";
import type { QuizMeta } from "@/lib/quizMeta";

export default function QuizCard({ quiz, size = "normal" }: { quiz: QuizMeta; size?: "normal" | "large" }) {
  const isLarge = size === "large";
  const visibleCategories = quiz.categories.slice(0, 2);
  const hiddenCategoryCount = Math.max(0, quiz.categories.length - visibleCategories.length);

  return (
    <Link href={`/quiz/${quiz.id}`} className="quiz-card block group">
      <div
        className={`relative ${isLarge ? "h-48" : "h-36"} flex items-center justify-center`}
        style={{ background: `linear-gradient(135deg, ${quiz.color}15, ${quiz.color}08)` }}
      >
        <Image
          src={quiz.thumbnail}
          alt={quiz.thumbnailAlt}
          fill
          sizes={isLarge ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className={quiz.thumbnailFit === "contain" ? "object-contain opacity-80 p-3" : "object-cover opacity-80"}
          style={{ objectPosition: quiz.thumbnailPosition ?? "center center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-neutral-950/10" />
        <div
          className="quiz-card-glow absolute inset-0 opacity-0 transition-opacity"
          style={{ background: `radial-gradient(circle at 50% 80%, ${quiz.color}, transparent 70%)` }}
        />
        <div className="absolute top-3 left-3 flex max-w-[calc(100%-4.5rem)] flex-wrap gap-1.5">
          {visibleCategories.map((category, index) => (
            <span
              key={category}
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                index === 0 ? "" : "bg-neutral-800 text-neutral-300"
              }`}
              style={index === 0 ? { background: `${quiz.color}25`, color: quiz.color } : undefined}
            >
              {category}
            </span>
          ))}
          {hiddenCategoryCount > 0 ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
              +{hiddenCategoryCount}
            </span>
          ) : null}
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400"
          >
            {quiz.kind === "map" ? "Map" : "List"}
          </span>
        </div>
        <div
          className="absolute bottom-3 left-3 w-9 h-9 rounded-lg flex items-center justify-center text-xl"
          style={{ background: "rgba(10,10,10,0.72)" }}
        >
          {quiz.icon}
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

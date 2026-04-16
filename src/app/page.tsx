"use client";
import { useMemo, useState } from "react";
import { QUIZ_META, CATEGORIES } from "@/lib/quizMeta";
import QuizCard from "@/components/QuizCard";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const featured = QUIZ_META.filter((q) => q.featured);

  const filtered = useMemo(() => {
    let result = QUIZ_META;
    if (activeCategory) result = result.filter((q) => q.category === activeCategory);
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (q) =>
          q.label.toLowerCase().includes(s) ||
          q.description.toLowerCase().includes(s) ||
          q.category.toLowerCase().includes(s)
      );
    }
    return result;
  }, [search, activeCategory]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4 pt-6 pb-2">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Type fast. Claim first. <span className="text-emerald-400">Win.</span>
        </h1>
        <p className="text-neutral-400 text-lg max-w-xl mx-auto">
          Real-time typing quizzes. Play solo to beat your own record, or challenge
          friends in a private room. First to type a correct answer claims it.
        </p>
      </section>

      {/* Featured */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
          Featured Quizzes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((q) => (
            <QuizCard key={q.id} quiz={q} size="large" />
          ))}
        </div>
      </section>

      {/* Search + Filters */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !activeCategory ? "bg-white text-black" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat ? "bg-white text-black" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Quizzes Grid */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
          {activeCategory ?? "All"} Quizzes
          <span className="text-neutral-600 ml-2">({filtered.length})</span>
        </h2>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            No quizzes match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((q) => (
              <QuizCard key={q.id} quiz={q} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

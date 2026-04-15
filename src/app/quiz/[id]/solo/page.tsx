"use client";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SoloGame from "@/components/SoloGame";

function SoloInner() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const time = params.get("time");
  const timeLimit = time ? Number(time) : null;
  return <SoloGame quizId={id} timeLimit={timeLimit || null} />;
}

export default function SoloPage() {
  return (
    <Suspense fallback={<main className="min-h-[80vh] flex items-center justify-center text-neutral-500">Loading…</main>}>
      <SoloInner />
    </Suspense>
  );
}

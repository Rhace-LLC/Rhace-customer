import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import {
  getDidYouKnow,
  type DidYouKnowFact,
} from "@/api-services/entertainment";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const prettyCategory = (category: string) =>
  category.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export function DidYouKnowCarousel() {
  const { token } = useAuth();
  const [facts, setFacts] = useState<DidYouKnowFact[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchFacts = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getDidYouKnow(token);
      setFacts(res?.facts ?? []);
    } catch {
      setFacts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFacts();
  }, [fetchFacts]);

  const count = facts.length;

  const go = useCallback(
    (direction: number) => {
      setIndex((current) =>
        count ? (current + direction + count) % count : 0
      );
    },
    [count]
  );

  // Auto-advance, paused while there is only one fact.
  useEffect(() => {
    if (count <= 1) return;
    timer.current = setInterval(() => go(1), 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count, go]);

  if (loading) {
    return (
      <section className="mt-12">
        <div className="h-28 w-full animate-pulse rounded-3xl bg-gray-100" />
      </section>
    );
  }

  if (count === 0) return null;

  return (
    <section className="mt-12 w-full min-w-0 overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <Lightbulb size={16} />
        </span>
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          Did you know?
        </h2>
      </div>

      {/*
        All slides share one grid cell so there is no horizontal track to
        overflow on mobile. The row is sized by the tallest fact, which also
        prevents the card from jumping height between slides.
      */}
      <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        {facts.map((fact, factIndex) => (
          <div
            key={fact.id}
            aria-hidden={factIndex !== index}
            className={cn(
              "col-start-1 row-start-1 w-full min-w-0 px-5 py-6 transition-opacity duration-500",
              factIndex === index
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            )}
          >
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">
              {prettyCategory(fact.category)}
            </span>
            <p className="mt-3 text-[15px] leading-relaxed font-medium break-words text-gray-700">
              {fact.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {facts.map((fact, dotIndex) => (
            <button
              key={fact.id}
              type="button"
              aria-label={`Go to fact ${dotIndex + 1}`}
              onClick={() => setIndex(dotIndex)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                dotIndex === index ? "w-5 bg-blue-500" : "w-1.5 bg-gray-200"
              )}
            />
          ))}
        </div>

        {count > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous fact"
              onClick={() => go(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next fact"
              onClick={() => go(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

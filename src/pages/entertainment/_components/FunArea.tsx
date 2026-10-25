import { Sparkles, Wand2 } from "lucide-react";

interface FunAreaProps {
  onBuildDish: () => void;
}

/**
 * "FUN Area" — playful activity section. Currently hosts the Build Your Own
 * Dish activity; more activities can be added as additional cards.
 */
export function FunArea({ onBuildDish }: FunAreaProps) {
  return (
    <section className="mt-12 w-full min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-500">
          <Sparkles size={16} />
        </span>
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          FUN Area
        </h2>
      </div>

      <button
        onClick={onBuildDish}
        className="group relative w-full overflow-hidden rounded-[2.5rem] bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-7 text-left text-white shadow-2xl shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40 active:scale-[0.98] sm:p-9"
      >
        {/* Ambient vibe blobs */}
        <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/25 blur-2xl transition-transform duration-500 group-hover:scale-125" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute top-6 right-8 text-5xl opacity-20 transition-transform duration-500 group-hover:rotate-12">
          🍽️
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur">
            <Wand2 size={13} />
            Activity
          </span>

          <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
            Let’s build a dish
          </h3>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed font-medium text-white/80">
            Answer a few quick questions and we’ll match you with the perfect
            dish for your mood.
          </p>

          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-bold text-purple-700 shadow-lg transition-transform duration-300 group-hover:translate-x-1">
            Start building
            <Sparkles size={16} />
          </span>
        </div>
      </button>
    </section>
  );
}

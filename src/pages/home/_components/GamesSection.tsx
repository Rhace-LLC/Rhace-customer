import { useState } from "react";
import { Gamepad2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { GAMES, type Game } from "./games";
import { GameModal } from "./GameModal";

/**
 * "Fun & Games" section. Lists the available games and opens the selected one
 * in a modal. The modal state is local to this section.
 */
export function GamesSection() {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePlay = (game: Game) => {
    setActiveGame(game);
    setIsOpen(true);
  };

  return (
    <section className="mt-12 w-full min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-500">
          <Gamepad2 size={16} />
        </span>
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          Fun &amp; Games
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => handlePlay(game)}
            className="group relative w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
          >
            <div
              className={cn(
                "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br text-2xl shadow-sm",
                game.accent
              )}
            >
              <span>{game.emoji}</span>
            </div>

            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              {game.tagline}
            </span>
            <h3 className="mt-1 text-[16px] font-bold tracking-tight text-gray-900">
              {game.title}
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed font-medium text-gray-500">
              {game.description}
            </p>

            <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-blue-600">
              <Play size={13} className="fill-blue-600" />
              Play now
            </span>
          </button>
        ))}
      </div>

      <GameModal game={activeGame} open={isOpen} onOpenChange={setIsOpen} />
    </section>
  );
}

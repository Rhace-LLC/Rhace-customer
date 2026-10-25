export interface Game {
  id: string;
  title: string;
  tagline: string;
  description: string;
  /** Path to the self-contained HTML game in `public/games/`. */
  src: string;
  emoji: string;
  /** Tailwind gradient stops for the card accent. */
  accent: string;
}

export const GAMES: Game[] = [
  {
    id: "bun-run",
    title: "Bun Run",
    tagline: "Arcade",
    description: "Dash and dodge your way to as many buns as you can grab.",
    src: "/games/bun-run.html",
    emoji: "🍔",
    accent: "from-amber-400 to-orange-500",
  },
  {
    id: "guess-the-ingredient",
    title: "Guess the Ingredient",
    tagline: "Quiz",
    description: "Crack the clues and name the secret ingredient.",
    src: "/games/guess-the-ingredient.html",
    emoji: "🧄",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "menu-match",
    title: "Menu Match",
    tagline: "Memory",
    description: "Flip the cards and match every dish before time runs out.",
    src: "/games/menu-match.html",
    emoji: "🍽️",
    accent: "from-rose-400 to-red-500",
  },
];

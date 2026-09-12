import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Game } from "./games";

interface GameModalProps {
  game: Game | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Full-bleed modal that hosts a self-contained HTML game in an iframe. */
export function GameModal({ game, open, onOpenChange }: GameModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] w-[95vw] max-w-5xl gap-0 overflow-hidden rounded-[2rem] border-none p-0">
        {game && (
          <iframe
            key={game.id}
            title={game.title}
            src={game.src}
            className="h-full w-full border-0 bg-[#FFF6E5]"
            allow="autoplay"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

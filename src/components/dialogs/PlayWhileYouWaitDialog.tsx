import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface PlayWhileYouWaitDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Shown right after an order is placed: invites the guest to play while the kitchen works. */
export function PlayWhileYouWaitDialog({
  isOpen,
  onClose,
}: PlayWhileYouWaitDialogProps) {
  const navigate = useNavigate();

  const handlePlay = () => {
    onClose();
    navigate("/entertainment");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] overflow-hidden rounded-[2.5rem] border-none p-0 shadow-2xl sm:max-w-100">
        <div className="relative overflow-hidden bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-8 pt-8 pb-10 text-white">
          <div className="pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full bg-white/25 blur-2xl" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
            🎮
          </span>
        </div>

        <div className="space-y-6 bg-white p-8 pt-6">
          <DialogHeader className="space-y-2 text-left">
            <p className="text-[12px] font-bold tracking-[0.25em] text-purple-500 uppercase">
              Order received
            </p>
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Play a game while you wait
            </DialogTitle>
            <DialogDescription className="text-[14px] leading-relaxed font-medium text-gray-500">
              Your order is being prepared. Pass the time with a quick game, and
              we'll keep your order updated in My Order.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handlePlay}
              className="h-12 rounded-xl bg-purple-600 text-[14px] font-bold text-white hover:bg-purple-700"
            >
              <Play size={16} className="fill-white" />
              Play now
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-12 rounded-xl text-[14px] font-bold text-gray-400 hover:text-gray-900"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

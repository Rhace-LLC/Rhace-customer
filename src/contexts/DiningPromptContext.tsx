import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDiningExperience } from "@/contexts/DiningExperienceContext";
import { Users, User } from "lucide-react";

export function DiningPreferencePrompt() {
  const {
    preferredDiningExperience,
    setPreferredDiningExperience,
    shouldPrompt,
    setShouldPrompt,
  } = useDiningExperience();

  return (
    <Dialog open={shouldPrompt}>
      <DialogContent
        className="max-w-[90vw] overflow-hidden rounded-[2.5rem] border-none p-0 shadow-2xl sm:max-w-[420px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="bg-white p-8 sm:p-10">
          <DialogHeader className="mb-8 space-y-3 text-left">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-blue-500 uppercase">
              Preference
            </p>
            <DialogTitle className="text-2xl font-semibold tracking-tighter text-gray-900">
              How would you like to dine?
            </DialogTitle>
            <DialogDescription className="text-[13px] leading-relaxed text-gray-400">
              Choose an experience to tailor how you order at this table.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-10 grid gap-4">
            {/* Personal Dining */}
            <button
              onClick={() => setPreferredDiningExperience("personal")}
              className={cn(
                "group relative flex items-center gap-5 rounded-[2rem] border p-5 text-left transition-all duration-300 active:scale-[0.98]",
                preferredDiningExperience === "personal"
                  ? "border-black bg-black text-white shadow-xl shadow-black/10"
                  : "border-gray-100 bg-white hover:border-gray-300"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                  preferredDiningExperience === "personal"
                    ? "bg-white/10"
                    : "bg-gray-50 group-hover:bg-gray-100"
                )}
              >
                <User
                  className={cn(
                    "h-5 w-5",
                    preferredDiningExperience === "personal"
                      ? "text-white"
                      : "text-gray-600"
                  )}
                />
              </div>

              <div className="space-y-1">
                <p
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    preferredDiningExperience === "personal"
                      ? "text-white"
                      : "text-gray-900"
                  )}
                >
                  Dine Alone
                </p>
                <p
                  className={cn(
                    "text-[11px] leading-snug",
                    preferredDiningExperience === "personal"
                      ? "text-white/60"
                      : "text-gray-400"
                  )}
                >
                  Manage your own order privately.
                </p>
              </div>
            </button>

            {/* Group Dining */}
            <button
              onClick={() => setPreferredDiningExperience("group")}
              className={cn(
                "group relative flex items-center gap-5 rounded-[2rem] border p-5 text-left transition-all duration-300 active:scale-[0.98]",
                preferredDiningExperience === "group"
                  ? "border-black bg-black text-white shadow-xl shadow-black/10"
                  : "border-gray-100 bg-white hover:border-gray-300"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                  preferredDiningExperience === "group"
                    ? "bg-white/10"
                    : "bg-gray-50 group-hover:bg-gray-100"
                )}
              >
                <Users
                  className={cn(
                    "h-5 w-5",
                    preferredDiningExperience === "group"
                      ? "text-white"
                      : "text-gray-600"
                  )}
                />
              </div>

              <div className="space-y-1">
                <p
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    preferredDiningExperience === "group"
                      ? "text-white"
                      : "text-gray-900"
                  )}
                >
                  Group Dining
                </p>
                <p
                  className={cn(
                    "text-[11px] leading-snug",
                    preferredDiningExperience === "group"
                      ? "text-white/60"
                      : "text-gray-400"
                  )}
                >
                  Order together with friends at this table.
                </p>
              </div>
            </button>
          </div>

          <Button
            disabled={!preferredDiningExperience}
            onClick={() => setShouldPrompt(false)}
            className="h-14 w-full rounded-2xl bg-black text-[11px] font-semibold tracking-[0.2em] text-white uppercase transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-10"
          >
            Confirm Experience
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

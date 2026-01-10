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
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>How would you like to dine?</DialogTitle>
          <DialogDescription>
            Choose how you want to experience ordering at this table.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Personal Dining */}
          <button
            className={cn(
              "flex items-center gap-4 rounded-lg border p-4 text-left transition",
              preferredDiningExperience === "personal"
                ? "border-primary bg-primary/10"
                : "hover:border-primary/50"
            )}
            onClick={() => setPreferredDiningExperience("personal")}
          >
            <User className="h-5 w-5" />
            <div>
              <p className="font-medium">Dine Alone</p>
              <p className="text-muted-foreground text-sm">
                Place and manage your own order privately.
              </p>
            </div>
          </button>

          {/* Group Dining */}
          <button
            className={cn(
              "flex items-center gap-4 rounded-lg border p-4 text-left transition",
              preferredDiningExperience === "group"
                ? "border-primary bg-primary/10"
                : "hover:border-primary/50"
            )}
            onClick={() => setPreferredDiningExperience("group")}
          >
            <Users className="h-5 w-5" />
            <div>
              <p className="font-medium">Group Dining</p>
              <p className="text-muted-foreground text-sm">
                Order together with friends or colleagues at the same table.
              </p>
            </div>
          </button>
        </div>

        <Button
          disabled={!preferredDiningExperience}
          className="w-full"
          onClick={() => {
            // dialog will close automatically because shouldPrompt becomes false
            setShouldPrompt(false);
          }}
        >
          Proceed
        </Button>
      </DialogContent>
    </Dialog>
  );
}

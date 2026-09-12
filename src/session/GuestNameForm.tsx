import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GuestNameInput } from "./useGuestLogin";

interface Props {
  onSubmit: (name: GuestNameInput) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}

export function GuestNameForm({ onSubmit, onBack, loading, error }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const canSubmit =
    firstName.trim().length > 0 && lastName.trim().length > 0 && !loading;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ first_name: firstName, last_name: lastName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-medium tracking-tight text-gray-700">
          First name
        </label>
        <Input
          autoFocus
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="e.g. Ada"
          className="h-12 rounded-xl bg-gray-100 px-5"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium tracking-tight text-gray-700">
          Last name
        </label>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="e.g. Okafor"
          className="h-12 rounded-xl bg-gray-100 px-5"
        />
      </div>

      <p className="text-[12px] leading-relaxed text-gray-400">
        This is only used by the waiter to identify you when your order arrives.
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={loading}
          className="h-14 rounded-2xl px-5 text-gray-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-black text-[15px] font-semibold tracking-tight text-white transition-all hover:bg-gray-800 active:scale-[0.98]",
            !canSubmit && "cursor-not-allowed opacity-40"
          )}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Continue as guest
              <ArrowRight className="h-4 w-4 opacity-60" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

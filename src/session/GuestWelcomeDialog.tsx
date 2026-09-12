import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { GuestNameForm } from "./GuestNameForm";
import { useGuestLogin, type GuestNameInput } from "./useGuestLogin";

type Step = "welcome" | "name";

export function GuestWelcomeDialog() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { submit, loading, error } = useGuestLogin();
  const [step, setStep] = useState<Step>("welcome");

  const handleGuestSubmit = async (name: GuestNameInput) => {
    try {
      const response = await submit(name);
      auth.guestLogin(response);
      toast.success(`Welcome, ${response.user.first_name}!`);
    } catch {
      // Error surfaced by useGuestLogin.
    }
  };

  return (
    <Dialog open>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-[90vw] overflow-hidden rounded-[2.5rem] border-none p-0 shadow-2xl [&>button]:hidden sm:max-w-[420px]"
      >
        <div className="bg-white p-8 sm:p-10">
          {step === "welcome" ? (
            <>
              <DialogHeader className="mb-8 space-y-3 text-left">
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                  <UserRound className="h-6 w-6 text-gray-700" />
                </div>
                <DialogTitle className="text-2xl font-semibold tracking-tighter text-gray-900">
                  Welcome to Rhace
                </DialogTitle>
                <DialogDescription className="text-[13px] leading-relaxed text-gray-400">
                  Log in to your account or continue as a guest to start
                  ordering in seconds. No sign up needed.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <button
                  onClick={() => setStep("name")}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-black text-[15px] font-semibold tracking-tight text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
                >
                  Continue as guest
                </button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="h-14 w-full rounded-2xl text-[15px] font-semibold tracking-tight text-gray-500 hover:text-gray-900"
                >
                  Log in
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader className="mb-8 space-y-2 text-left">
                <p className="text-[10px] font-semibold tracking-[0.3em] text-blue-500 uppercase">
                  Almost there
                </p>
                <DialogTitle className="text-2xl font-semibold tracking-tighter text-gray-900">
                  What's your name?
                </DialogTitle>
                <DialogDescription className="text-[13px] leading-relaxed text-gray-400">
                  Tell us who you are so the waiter can find you at the table.
                </DialogDescription>
              </DialogHeader>

              <GuestNameForm
                onSubmit={handleGuestSubmit}
                onBack={() => setStep("welcome")}
                loading={loading}
                error={error}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

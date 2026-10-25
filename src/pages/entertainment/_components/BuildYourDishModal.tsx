import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  createBuildYourDish,
  getBuildYourDish,
  type BuildYourDishQuestion,
  type BuildYourDishRecommendation,
} from "@/api-services/entertainment";
import { parseError } from "@/api-services/utils/parseError";
import { formatCurrency } from "@/pages/utils/helpers";
import { cn } from "@/lib/utils";

interface BuildYourDishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId?: string;
}

const prepMinutes = (value: string): number | null => {
  const match = /^(\d+):(\d+):(\d+)/.exec(value ?? "");
  if (!match) return null;
  const total =
    Number(match[1]) * 60 + Number(match[2]) + Math.round(Number(match[3]) / 60);
  return total > 0 ? total : null;
};

export function BuildYourDishModal({
  open,
  onOpenChange,
  restaurantId,
}: BuildYourDishModalProps) {
  const { token } = useAuth();

  const [questions, setQuestions] = useState<BuildYourDishQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] =
    useState<BuildYourDishRecommendation | null>(null);

  const [fetched, setFetched] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingQuestions(true);
      setError(null);
      const res = await getBuildYourDish(token);
      setQuestions(res?.questions ?? []);
    } catch (err) {
      setError(parseError(err) || "Failed to load questions.");
    } finally {
      setLoadingQuestions(false);
    }
  }, [token]);

  // Reset transient state whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    setAnswers({});
    setRecommendation(null);
    setError(null);
  }, [open]);

  // Load the question set once.
  useEffect(() => {
    if (open && token && !fetched) {
      setFetched(true);
      fetchQuestions();
    }
  }, [open, token, fetched, fetchQuestions]);

  const answeredCount = useMemo(
    () => questions.filter((question) => answers[question.key]).length,
    [questions, answers]
  );
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  const selectAnswer = (key: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const handleBuild = async () => {
    if (!restaurantId) {
      setError("No restaurant selected.");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const res = await createBuildYourDish(restaurantId, answers, token);
      setRecommendation(res.recommendation);
    } catch (err) {
      setError(parseError(err) || "Failed to build your dish.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setRecommendation(null);
    setAnswers({});
    setError(null);
  };

  const minutes =
    recommendation && prepMinutes(recommendation.prep_time)
      ? prepMinutes(recommendation.prep_time)
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-[92vw] overflow-y-auto rounded-[2rem] p-0 sm:max-w-md">
        <div className="bg-white p-6 sm:p-8">
          <DialogHeader className="mb-6 space-y-2 text-left">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.3em] text-blue-500 uppercase">
              <Sparkles size={12} />
              Build your dish
            </p>
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              {recommendation
                ? "We found your match"
                : "Tell us what you're craving"}
            </DialogTitle>
            <DialogDescription className="text-[13px] leading-relaxed text-gray-400">
              {recommendation
                ? "Based on your answers, this is what we recommend."
                : "Answer a few quick questions and we'll pick the perfect dish for you."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-2xl bg-rose-50 p-3 text-[13px] text-rose-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* QUESTIONS */}
          {!recommendation && (
            <>
              {loadingQuestions ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-[13px] font-medium">
                    Loading questions...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question.key} className="space-y-3">
                      <p className="text-sm font-semibold tracking-tight text-gray-800">
                        {question.question}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((option) => {
                          const active = answers[question.key] === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                selectAnswer(question.key, option.value)
                              }
                              className={cn(
                                "rounded-full border px-4 py-2 text-[13px] font-medium transition-all active:scale-95",
                                active
                                  ? "border-black bg-black text-white"
                                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                              )}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-5">
                    <div className="mb-3 flex items-center justify-between text-[11px] font-medium text-gray-400">
                      <span>
                        {answeredCount} of {questions.length} answered
                      </span>
                      {allAnswered && (
                        <span className="flex items-center gap-1 text-emerald-500">
                          <CheckCircle2 size={13} />
                          Ready
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleBuild}
                      disabled={!allAnswered || submitting}
                      className={cn(
                        "flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold tracking-tight text-white transition-all active:scale-[0.98]",
                        allAnswered && !submitting
                          ? "bg-black hover:bg-gray-800"
                          : "cursor-not-allowed bg-gray-300"
                      )}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Building...
                        </>
                      ) : (
                        "Build my dish"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* RECOMMENDATION */}
          {recommendation && (
            <div className="space-y-5">
              <div className="overflow-hidden rounded-3xl border border-gray-100">
                {recommendation.image_url ? (
                  <img
                    src={recommendation.image_url}
                    alt={recommendation.name}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-gray-50 text-gray-300">
                    <UtensilsCrossed size={40} />
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">
                  {recommendation.category?.name ?? "Recommendation"}
                </span>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
                  {recommendation.name}
                </h3>
                {recommendation.description && (
                  <p className="mt-2 text-[14px] leading-relaxed font-medium text-gray-500">
                    {recommendation.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    recommendation.promotion_price ?? recommendation.price
                  )}
                </span>
                {recommendation.promotion_price && (
                  <span className="text-sm font-medium text-gray-400 line-through">
                    {formatCurrency(recommendation.price)}
                  </span>
                )}
                {minutes && (
                  <span className="ml-auto rounded-full bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-500">
                    ~{minutes} min
                  </span>
                )}
              </div>

              {(recommendation.display_ingredients?.length ?? 0) > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                    Ingredients
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.display_ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[12px] font-medium text-gray-600"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(recommendation.allergens?.length ?? 0) > 0 && (
                <p className="rounded-2xl bg-amber-50 p-3 text-[12px] font-medium text-amber-700">
                  Contains: {recommendation.allergens.join(", ")}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={reset}
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 text-[14px] font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
                >
                  <RefreshCw size={16} />
                  Build again
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-black text-[14px] font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

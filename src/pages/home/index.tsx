import {
  Smartphone,
  Camera,
  ArrowRight,
  ChefHat,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { QRScanDialog } from "@/components/dialogs/QRScanDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useRestaurant } from "./useRestaurant";
import { useSetupContext } from "@/contexts/SetupContext";
import { useParseSelection } from "@/hooks/useParseSelection";

const fallbackGallery = [
  "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b",
  "https://images.unsplash.com/photo-1556742393-d75f468bfcb0",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
];

const getRandomImage = (images: string[]): string => {
  return images[Math.floor(Math.random() * images.length)];
};

const sloganList = [
  "Fresh Meals, Great Vibes",
  "Where Every Bite Feels Like Home",
  "Taste the Difference",
  "Good Food. Good Mood.",
  "Savor the Flavor",
  "Crafted With Love, Served With Passion",
  "Your Daily Dose of Delicious",
  "Great Taste, Every Time",
  "A Feast for Your Senses",
  "Made Fresh, Made For You",
  "Tasty Moments Await",
  "Food That Warms the Soul",
  "Flavors You’ll Always Remember",
  "Where Hunger Meets Happiness",
  "Bringing People Together Through Food",
  "Comfort Food, Elevated",
  "Cooked Right. Served Right.",
  "A Place for Food Lovers",
  "Where Quality Meets Taste",
  "Your Favorite Spot in Town",
];

const randomPickedSlogan =
  sloganList[Math.floor(Math.random() * sloganList.length)];

const randomFallbackImage = getRandomImage(fallbackGallery);

export function HomePage() {
  const navigate = useNavigate();
  const { parseAndSetSelection } = useParseSelection();

  const setup = useSetupContext();
  const selectedRestaurant = setup.selectedRestaurant;
  const restaurantId = setup.selectedRestaurant?.restaurantId;

  const { restaurant, loading, error, refetch } = useRestaurant();
  const shouldPromptQRScan = !selectedRestaurant?.restaurantId;

  const [isQRScanOpen, setIsQRScanOpen] = useState(false);
  const handleQRScan = () => setIsQRScanOpen(true);

  const handleScanSuccess = (data: string) => {
    try {
      const parsed = parseAndSetSelection(data);
      if (parsed && parsed.tableNo) {
        toast.success(`Welcome! You're now seated at Table ${parsed.tableNo}`);
      } else {
        toast.error(
          JSON.stringify(parsed) +
            "Invalid QR data — no table information found. " +
            data
        );
      }
    } catch (error) {
      toast.error("Invalid QR code. Please try again.");
    } finally {
      setIsQRScanOpen(false);
    }
  };

  const handleDialogClose = () => {
    setIsQRScanOpen(false);
  };

  useEffect(() => {
    if (!restaurant) {
      refetch();
    }
  }, [restaurantId]);

  return (
    <div className="min-h-[calc(100vh-65px)] bg-white selection:bg-blue-100">
      <div className="mx-auto max-w-2xl px-6 py-10 pb-24">
        {/* QR Scanner Dialog remains logic-untouched */}
        <QRScanDialog
          isOpen={isQRScanOpen}
          onClose={handleDialogClose}
          onSuccess={handleScanSuccess}
        />

        {!shouldPromptQRScan && (
          <div className={`${restaurant ? "pt-0" : "pt-10"}`}>
            {/* 1. LOADING STATE - REFINED SKELETON */}
            {loading && (
              <div className="animate-in fade-in w-full space-y-8 duration-700">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24 rounded-full bg-gray-100" />
                  <Skeleton className="h-10 w-3/4 rounded-2xl bg-gray-100" />
                </div>
                <Skeleton className="h-64 w-full rounded-[2.5rem] bg-gray-100/80" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full rounded-full bg-gray-50" />
                  <Skeleton className="h-4 w-5/6 rounded-full bg-gray-50" />
                </div>
              </div>
            )}

            {/* 2. ERROR STATE - MINIMALIST ALERTS */}
            {error && !loading && (
              <div className="animate-in zoom-in-95 flex flex-col items-center justify-center py-20 text-center duration-500">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50">
                  <AlertCircle
                    className="text-rose-500"
                    size={28}
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  System Sync Error
                </h2>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed font-medium text-gray-400">
                  {error}
                </p>
                <Button
                  onClick={refetch}
                  className="mt-8 h-14 w-full max-w-60 rounded-2xl bg-gray-900 text-[15px] font-bold text-white shadow-xl shadow-black/10 transition-all active:scale-95"
                >
                  Retry Connection
                </Button>
              </div>
            )}

            {/* 3. RESTAURANT PROFILE - EDITORIAL LAYOUT */}
            {restaurant && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-1000">
                {/* Cover Image - Architectural Frame */}
                <div className="group relative overflow-hidden rounded-[3rem] shadow-2xl shadow-black/5">
                  <img
                    src={restaurant?.cover_image_url || randomFallbackImage}
                    alt={`${restaurant.name} cover`}
                    className="h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                </div>

                {/* Heading & Slogan */}
                <div className="space-y-3 px-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold tracking-[0.3em] text-blue-500 uppercase">
                      Welcome to
                    </span>
                    <div className="h-px w-12 bg-blue-100" />
                  </div>
                  <h3 className="text-4xl font-extrabold tracking-[-0.05em] text-gray-900 lg:text-5xl">
                    {restaurant?.name}
                  </h3>
                  <p className="text-[17px] leading-relaxed font-medium text-gray-400 italic">
                    {restaurant?.slogan || randomPickedSlogan}
                  </p>
                </div>

                {/* Action Buttons - High Contrast */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => navigate("/menu")}
                    className="flex h-16 items-center justify-between rounded-3xl bg-black px-8 text-[15px] font-bold tracking-tight text-white shadow-2xl shadow-black/20 transition-all hover:bg-gray-800 active:scale-[0.98]"
                  >
                    <span>Browse the Menu</span>
                    <ArrowRight className="h-5 w-5 opacity-50" />
                  </button>

                  <button
                    onClick={() => toast.info("A waiter has been notified!")}
                    className="hidden h-16 items-center justify-between rounded-3xl border border-gray-100 bg-white px-8 text-[15px] font-bold tracking-tight text-gray-900 transition-all hover:bg-gray-50 active:scale-[0.98]"
                  >
                    <span>Request Service</span>
                    <ChefHat className="h-5 w-5 text-gray-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. QR PROMPT STATE - MINIMALIST FOCUS */}
        {shouldPromptQRScan && (
          <div className="animate-in fade-in flex min-h-[70vh] flex-col items-center justify-center py-12 text-center duration-700">
            <div className="relative mb-10 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-50 opacity-75" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Smartphone size={32} strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-4 px-4">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Ready to dine?
              </h2>
              <p className="mx-auto max-w-[280px] text-[15px] leading-relaxed font-medium text-gray-400">
                Scan the QR code on your table to unlock the menu and start your
                experience.
              </p>
            </div>

            <button
              onClick={handleQRScan}
              className="mt-12 flex h-16 w-full max-w-[280px] items-center justify-center gap-3 rounded-4xl bg-black text-[15px] font-bold text-white shadow-2xl shadow-black/20 transition-all active:scale-95"
            >
              Scan Table QR
              <Camera size={18} className="opacity-50" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

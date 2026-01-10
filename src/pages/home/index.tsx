import {
  Smartphone,
  Camera,
  UtensilsCrossed,
  ArrowRight,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { QRScanDialog } from "@/components/dialogs/QRScanDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelection } from "@/store/restaurant_selection.slice";
import { Skeleton } from "@/components/ui/skeleton";
import { useRestaurant } from "./useSelectedRestaurant";

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
  const dispatch = useDispatch();

  function parseAndDispatchSelection(fullUrl: string) {
    try {
      // Create URL instance for robust parsing
      const url = new URL(fullUrl);

      const tableId = url.searchParams.get("tid") || "";
      const tableNo = url.searchParams.get("tno") || "";
      const restaurantId = url.searchParams.get("rid") || "";
      const restaurantName = url.searchParams.get("r") || "";

      // Only dispatch if values exist
      if (tableId && restaurantId && restaurantName) {
        dispatch(
          setSelection({
            tableId,
            restaurantId,
            restaurantName,
            tableNo,
          })
        );
        return {
          tableId,
          restaurantId,
          restaurantName,
        };
      }

      return null; // invalid / incomplete params
    } catch (error) {
      console.error("Invalid URL passed to parseAndDispatchSelection:", error);
      return null;
    }
  }

  const selectedRestaurant = useSelector(
    (state: RootState) => state.selectedRestaurant
  );

  const { restaurant, loading, error, refetch } = useRestaurant({
    restaurantId: selectedRestaurant?.restaurantId || "",
  });

  const shouldPromptQRScan = !selectedRestaurant.restaurantId;

  const [isQRScanOpen, setIsQRScanOpen] = useState(false);
  const handleQRScan = () => setIsQRScanOpen(true);

  const handleScanSuccess = (data: string) => {
    console.log("Data:", data);
    try {
      const parsed = parseAndDispatchSelection(data);

      if (parsed && parsed.tableId) {
        toast.success(`Welcome! You're now seated at Table ${parsed.tableId}`);
      } else {
        console.warn("⚠️ QR data missing tableId:", parsed);
        toast.error(
          JSON.stringify(parsed) +
            "Invalid QR data — no table information found. " +
            data
        );
      }
    } catch (error) {
      console.error("❌ Failed to parse QR code data:", error);
      toast.error("Invalid QR code. Please try again.");
    } finally {
      setIsQRScanOpen(false);
    }
  };

  const handleDialogClose = (data: string) => {
    console.log("Dialog closed:", data);
    setIsQRScanOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50">
      <div className="space-y-6 p-3 pb-15">
        {/* QR Scanner Dialog */}
        <QRScanDialog
          isOpen={isQRScanOpen}
          onClose={handleDialogClose}
          onSuccess={handleScanSuccess}
        />
        {!shouldPromptQRScan && (
          <div className={`${restaurant ? "pt-2" : "pt-10"}`}>
            {loading && (
              <div className="w-full">
                <div className="animate-pulse space-y-4">
                  <p className="text-muted-foreground mt-4 text-center">
                    Loading restaurant profile...
                  </p>
                  <Skeleton className="bg-primary/20 h-8 w-1/2 rounded-md" />
                  <Skeleton className="bg-primary/10 h-6 w-3/4 rounded-md" />
                  <Skeleton className="bg-primary/20 h-48 w-full rounded-xl" />
                  <Skeleton className="bg-primary/10 h-4 w-full rounded-md" />
                  <Skeleton className="bg-primary/20 h-4 w-5/6 rounded-md" />
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="mx-auto max-w-xl space-y-10 rounded-xl border border-red-300 bg-red-50 p-6 text-center">
                <h2 className="mb-2 text-xl font-semibold text-red-600">
                  Oops! Something went wrong while trying to load restaurant
                  profile
                </h2>
                <p className="mb-4 text-red-700">{error}</p>
                <Button
                  onClick={refetch}
                  className={`h-12 w-full cursor-pointer rounded-lg border border-red-200 bg-red-100 px-4 py-2 font-medium text-red-600 transition-colors duration-200 hover:border-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none`}
                >
                  Retry
                </Button>
              </div>
            )}

            {restaurant && (
              <div className="mx-auto max-w-4xl space-y-6">
                {/* Cover Image */}
                <div className="overflow-hidden rounded-xl shadow-md">
                  <img
                    src={restaurant.cover_image_url || randomFallbackImage}
                    alt={`${restaurant.name} cover`}
                    className="h-64 w-full object-cover"
                  />
                </div>

                {/* Heading & Slogan */}
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                    Welcome to {restaurant.name}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {restaurant.slogan || randomPickedSlogan}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col justify-center gap-4 sm:flex-row">
                  {/* Browse Menu - Dark */}
                  <button
                    onClick={() => navigate("/menu")}
                    className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-gray-800"
                  >
                    Browse Menu <ArrowRight className="h-5 w-5" />
                  </button>

                  {/* Ping Assigned Waiter - Outline */}
                  <button
                    onClick={() => toast.info("A waiter has been notified!")}
                    className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-50"
                  >
                    Ping Assigned Waiter <ChefHat className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="hidden min-h-[70vh] flex-col items-center justify-center space-y-6 px-6 text-center">
              {/* Icon */}
              <div className="bg-primary/10 text-primary mb-2 rounded-full p-6 shadow-sm">
                <UtensilsCrossed className="h-10 w-10" />
              </div>

              {/* Text Section */}
              <div className="max-w-sm">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  Welcome to {selectedRestaurant.restaurantName}
                </h2>

                <p className="text-muted-foreground">
                  You’re now seated at{" "}
                  <span className="text-primary font-semibold">
                    Table {selectedRestaurant.tableNo}
                  </span>
                  .
                </p>

                <p className="text-muted-foreground mt-2">
                  A waiter will be with you shortly — or you can start exploring
                  the menu and place your order right here.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
                <Button
                  className="bg-primary hover:bg-primary/90 h-11 cursor-pointer rounded-[9px]"
                  onClick={() => navigate("/menu")}
                >
                  Browse Menu
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-11 rounded-[9px]"
                  onClick={() => toast.info("A waiter has been notified!")}
                >
                  Notify Waiter
                </Button>
              </div>
            </div>
          </div>
        )}

        {shouldPromptQRScan && (
          <>
            {/* Should prompt users to scan their stuff*/}
            <div className="h-full rounded-xl bg-white p-6 text-center">
              <div className="flex min-h-[65vh] flex-col items-center justify-center px-6 text-center">
                <div className="bg-primary/10 text-primary mb-6 animate-pulse rounded-full p-6 shadow-sm">
                  <Smartphone className="h-10 w-10" />
                </div>

                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  No Active Table Found
                </h2>

                <p className="mb-6 max-w-sm text-sm text-gray-500">
                  To place an order, simply scan the QR code available on your
                  table. This will automatically load your table and show you
                  the menu.
                </p>

                <button
                  onClick={handleQRScan} // <-- or navigate("/scan") depending on your flow
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-full px-5 py-2.5 text-white shadow-md transition-all active:scale-95"
                >
                  Scan QR Code
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

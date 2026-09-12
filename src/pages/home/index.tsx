import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QRScanDialog } from "@/components/dialogs/QRScanDialog";
import { useRestaurant } from "./useRestaurant";
import { useSetupContext } from "@/contexts/SetupContext";
import { useParseSelection } from "@/hooks/useParseSelection";
import {
  BuildYourDishModal,
  DidYouKnowCarousel,
  FunArea,
  HomeError,
  HomeLoading,
  QRScanPrompt,
  RestaurantProfile,
} from "./_components";

export function HomePage() {
  const navigate = useNavigate();
  const { parseAndSetSelection } = useParseSelection();

  const setup = useSetupContext();
  const selectedRestaurant = setup.selectedRestaurant;
  const restaurantId = setup.selectedRestaurant?.restaurantId;

  const { restaurant, loading, error, refetch } = useRestaurant();
  const shouldPromptQRScan = !selectedRestaurant?.restaurantId;

  const [isQRScanOpen, setIsQRScanOpen] = useState(false);
  const [isBuildDishOpen, setIsBuildDishOpen] = useState(false);

  const handleQRScan = () => setIsQRScanOpen(true);
  const handleDialogClose = () => setIsQRScanOpen(false);

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
    } catch {
      toast.error("Invalid QR code. Please try again.");
    } finally {
      setIsQRScanOpen(false);
    }
  };

  useEffect(() => {
    if (!restaurant) {
      refetch();
    }
  }, [restaurantId]);

  return (
    <div className="min-h-[calc(100vh-65px)] bg-white selection:bg-blue-100">
      <div className="mx-auto max-w-2xl px-6 py-10 pb-24">
        <QRScanDialog
          isOpen={isQRScanOpen}
          onClose={handleDialogClose}
          onSuccess={handleScanSuccess}
        />

        {!shouldPromptQRScan && (
          <div className={restaurant ? "pt-0" : "pt-10"}>
            {loading && <HomeLoading />}

            {error && !loading && (
              <HomeError message={error} onRetry={refetch} />
            )}

            {restaurant && (
              <>
                <RestaurantProfile
                  restaurant={restaurant}
                  onBrowseMenu={() => navigate("/menu")}
                />
                <FunArea onBuildDish={() => setIsBuildDishOpen(true)} />
              </>
            )}
          </div>
        )}

        {shouldPromptQRScan && <QRScanPrompt onScan={handleQRScan} />}
        <BuildYourDishModal
          open={isBuildDishOpen}
          onOpenChange={setIsBuildDishOpen}
          restaurantId={restaurantId ?? undefined}
        />

        <DidYouKnowCarousel />
      </div>
    </div>
  );
}

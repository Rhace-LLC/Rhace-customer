import { QrCode, Smartphone, Camera, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { QRScanDialog } from "@/components/dialogs/QRScanDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelection } from "@/store/restaurant_selection.slice";

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

  const shouldPromptQRScan = !selectedRestaurant.restaurantId;

  console.log("Selected Restaurant: ", shouldPromptQRScan);

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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-6 p-5">
        {/* QR Scanner Dialog */}
        <QRScanDialog
          isOpen={isQRScanOpen}
          onClose={handleDialogClose}
          onSuccess={handleScanSuccess}
        />

        {/* Welcome Section */}
        <div className="rounded-xl bg-white p-6 text-center">
          {shouldPromptQRScan ? (
            <>
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
            </>
          ) : (
            <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 px-6 text-center">
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
                  variant="outline"
                  className="h-11 rounded-[9px]"
                  onClick={() => toast.info("A waiter has been notified!")}
                >
                  Notify Waiter
                </Button>

                <Button
                  className="bg-primary hover:bg-primary/90 h-11 rounded-[9px]"
                  onClick={() => navigate("/menu")}
                >
                  Browse Menu
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating QR Button */}
      <Button
        onClick={handleQRScan}
        size="icon"
        className="bg-primary hover:bg-primary/90 fixed right-5 bottom-24 z-40 hidden h-14 w-14 rounded-full shadow-lg"
      >
        <QrCode className="h-6 w-6" />
      </Button>
    </div>
  );
}

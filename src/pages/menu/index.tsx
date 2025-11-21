import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";
import { setSelection } from "@/store/restaurant_selection.slice";
import { Button } from "@/components/ui/button";
import { QrCode, ScanLine } from "lucide-react";
import { QRScanDialog } from "@/components/dialogs/QRScanDialog";
import { toast } from "sonner";
import { RenderMenuCategoryDishes } from "./rendermenu";

export function MenuPage() {
  const [isQRScanOpen, setIsQRScanOpen] = useState(false);

  const handleQRScan = () => setIsQRScanOpen(true);

  const dispatch = useDispatch();

  const selectedRestaurant = useSelectedRestaurant();

  const shouldProceed = !selectedRestaurant.restaurantId;

  const handleScanSuccess = (data: string) => {
    try {
      const parsed = parseAndDispatchSelection(data);

      if (parsed && parsed.tableId) {
        toast.success(`Welcome! You're now seated at Table ${parsed.tableId}`);
      } else {
        toast.error("Invalid QR — table information missing.");
      }
    } catch {
      toast.error("Invalid QR code. Please try again.");
    } finally {
      setIsQRScanOpen(false);
    }
  };

  const handleDialogClose = () => {
    setIsQRScanOpen(false);
  };

  function parseAndDispatchSelection(fullUrl: string) {
    try {
      const url = new URL(fullUrl);

      const tableId = url.searchParams.get("tid") || "";
      const tableNo = url.searchParams.get("tno") || "";
      const restaurantId = url.searchParams.get("rid") || "";
      const restaurantName = url.searchParams.get("r") || "";

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

      return null;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {shouldProceed && <ScanRequiredUI onScan={handleQRScan} />}

      {!shouldProceed && (
        <>
          <RenderMenuCategoryDishes />
        </>
      )}

      <QRScanDialog
        isOpen={isQRScanOpen}
        onClose={handleDialogClose}
        onSuccess={handleScanSuccess}
      />
    </div>
  );
}

function ScanRequiredUI({ onScan }: { onScan: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-6 animate-pulse rounded-full bg-blue-50 p-10">
        <ScanLine className="h-20 w-20 text-blue-600" />
      </div>

      <h2 className="mb-3 text-[18px] font-bold text-gray-800">
        Scan Your Table QR Code
      </h2>

      <p className="mb-8 max-w-sm text-gray-600">
        To access this restaurant’s menu, please scan the QR code on your table.
        This helps us identify your table and provide a smooth ordering
        experience.
      </p>

      <Button
        onClick={onScan}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-lg text-white hover:bg-blue-700"
      >
        <QrCode className="h-5 w-5" />
        Scan QR to Continue
      </Button>
    </div>
  );
}

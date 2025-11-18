import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getAllCategories } from "@/api-services/menu.service";
import { updatMenuCategoryData } from "@/store/menuSlice";
import { parseError } from "@/api-services/utils/parseError";
import { ContentHOC } from "@/components/nocontent";
import { RenderMenuCategory } from "./rendercat";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";
import { setSelection } from "@/store/restaurant_selection.slice";
import { Button } from "@/components/ui/button";
import { QrCode, ScanLine } from "lucide-react";
import { QRScanDialog } from "@/components/dialogs/QRScanDialog";
import { toast } from "sonner";

export function MenuPage() {
  const [isQRScanOpen, setIsQRScanOpen] = useState(false);

  const handleQRScan = () => setIsQRScanOpen(true);

  const dispatch = useDispatch();
  const auth = useAuth();
  const selectedRestaurant = useSelectedRestaurant();

  const shouldProceed = !selectedRestaurant.restaurantId;

  const dataStore = useSelector((state: RootState) => state.menu);
  const allCatData = dataStore.categoryData;

  const [fetchCategoryLoading, setFetchCategoryLoading] = useState(false);
  const [fetchCategoryError, setFetchCategoryError] = useState("");

  const handleScanSuccess = (data: string) => {
    try {
      const parsed = parseAndDispatchSelection(data);

      if (parsed && parsed.tableId) {
        toast.success(`Welcome! You're now seated at Table ${parsed.tableId}`);
        fetchCategory();
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

  const fetchCategory = async () => {
    try {
      setFetchCategoryLoading(true);
      setFetchCategoryError("");

      const res = await getAllCategories(
        selectedRestaurant.restaurantId || "",
        auth.token
      );

      dispatch(updatMenuCategoryData(res));
    } catch (error: any) {
      setFetchCategoryError(parseError(error));
    } finally {
      setFetchCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (allCatData.length === 0 && !shouldProceed) {
      fetchCategory();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ❗ SHOW BLOCKER UI UNTIL THEY SCAN QR */}
      {shouldProceed && <ScanRequiredUI onScan={handleQRScan} />}

      {/* CONTENT (only if scanned) */}
      {!shouldProceed && (
        <>
          <ContentHOC
            loading={fetchCategoryLoading}
            error={!!fetchCategoryError}
            noContent={allCatData.length === 0}
            loadingText="Fetching Categories. Please Wait."
            noContentMessage="Reload Categories List"
            noContentBtnText="Reload Categories"
            noContentAction={fetchCategory}
            errMessage={fetchCategoryError || "Failed to load categories."}
            actionFn={fetchCategory}
          >
            <RenderMenuCategory />
          </ContentHOC>
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

/* -------------------------------------------------------------
   BLOCKER UI COMPONENT
------------------------------------------------------------- */

function ScanRequiredUI({ onScan }: { onScan: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-6 animate-pulse rounded-full bg-blue-50 p-10">
        <ScanLine className="h-20 w-20 text-blue-600" />
      </div>

      <h2 className="mb-3 text-2xl font-bold text-gray-800">
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

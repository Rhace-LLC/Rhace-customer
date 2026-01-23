import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, ScanLine } from "lucide-react";
import { QRScanDialog } from "@/components/dialogs/QRScanDialog";
import { toast } from "sonner";
import { RenderMenuCategoryDishes } from "./rendermenu";
import { useSetupContext } from "@/contexts/SetupContext";
import { useParseSelection } from "@/hooks/useParseSelection";

export function MenuPage() {
  const [isQRScanOpen, setIsQRScanOpen] = useState(false);
  const { parseAndSetSelection } = useParseSelection();
  const handleQRScan = () => setIsQRScanOpen(true);

  const setup = useSetupContext();
  const selectedRestaurant = setup.selectedRestaurant;

  const shouldProceed = !selectedRestaurant?.restaurantId;

  const handleScanSuccess = (data: string) => {
    try {
      const parsed = parseAndSetSelection(data);
      if (parsed && parsed.tableNo) {
        toast.success(`Welcome! You're now seated at Table ${parsed.tableNo}`);
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
    <div className="animate-in fade-in flex min-h-[70vh] flex-col items-center justify-center bg-white px-8 text-center duration-1000">
      {/* BREATHING ICON ARCHITECTURE */}
      <div className="relative mb-12 flex h-32 w-32 items-center justify-center">
        {/* Subtle breathing rings */}
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-50/50 [animation-duration:3s]" />
        <div className="absolute inset-4 rounded-full bg-blue-50/80" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-2xl ring-1 shadow-blue-200/50 ring-blue-100">
          <ScanLine className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
        </div>
      </div>

      {/* TEXT ARCHITECTURE */}
      <div className="space-y-4 px-2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[12px] font-bold tracking-[0.3em] text-blue-500/80 uppercase">
            Scan Table QR
          </span>
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-gray-900">
            Scan to access Menu
          </h2>
        </div>

        <p className="mx-auto max-w-[300px] text-[15px] leading-relaxed font-medium text-gray-400">
          Please scan the QR code located on your table to unlock the menu and
          start your experience.
        </p>
      </div>

      {/* ACTION ARCHITECTURE */}
      <div className="mt-12 w-full max-w-[280px]">
        <Button
          onClick={onScan}
          className="group relative h-16 w-full overflow-hidden rounded-[2rem] bg-black text-[15px] font-bold tracking-tight text-white shadow-2xl shadow-black/20 transition-all hover:bg-gray-900 active:scale-[0.97]"
        >
          <div className="flex items-center justify-center gap-3">
            <QrCode className="h-5 w-5 opacity-50 transition-transform group-hover:scale-110" />
            <span>Open Table Scanner</span>
          </div>

          {/* Subtle light sweep effect on hover */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </Button>

        <p className="mt-6 text-[12px] font-bold tracking-widest text-gray-300 uppercase">
          Step 1 of 2
        </p>
      </div>
    </div>
  );
}

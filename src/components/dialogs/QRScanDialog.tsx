import { useState } from "react";
import { X, Camera, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useZxing } from "react-zxing";
import { cn } from "@/lib/utils";

interface QRScanDialogProps {
  isOpen: boolean;
  onClose: (data: string) => void;
  onSuccess: (data: string) => void;
}

export function QRScanDialog({
  isOpen,
  onClose,
  onSuccess,
}: QRScanDialogProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { ref: zxingRef } = useZxing({
    paused: !scanning,
    onDecodeResult: (result: any) => {
      const text: string = result.getText();
      if (!text) return;

      setScanning(false);
      onSuccess(text);
    },
    onError: (err: any) => {
      console.error(err);
      setError("Unable to access camera or scan QR code");
      toast.error("Unable to access camera or scan QR code");
    },
  });

  const handleDialogClose = () => {
    setScanning(false);
    onClose("Closed");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[90vw] overflow-hidden rounded-[2.5rem] border-none p-0 shadow-2xl sm:max-w-md">
        <div className="bg-white p-8 sm:p-10">
          {/* HEADER SECTION */}
          <DialogHeader className="mb-8 text-left">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[12px] font-bold tracking-[0.2em] text-blue-500 uppercase">
                  Secure Link
                </p>
                <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
                  Scan QR Code
                </DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDialogClose}
                className="rounded-full bg-gray-50 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-8">
            {/* SCANNER VIEWPORT */}
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gray-900 shadow-inner">
              {scanning ? (
                <>
                  <video
                    ref={zxingRef}
                    className="h-full w-full object-cover grayscale-[0.2] transition-all"
                  />
                  {/* CORNER OVERLAYS */}
                  <div className="pointer-events-none absolute inset-12">
                    <div className="absolute top-0 left-0 h-8 w-8 rounded-tl-xl border-t-2 border-l-2 border-white/80" />
                    <div className="absolute top-0 right-0 h-8 w-8 rounded-tr-xl border-t-2 border-r-2 border-white/80" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-white/80" />
                    <div className="absolute right-0 bottom-0 h-8 w-8 rounded-br-xl border-r-2 border-b-2 border-white/80" />
                  </div>
                  {/* SCANNING LINE ANIMATION */}
                  <div className="animate-scan absolute inset-x-12 top-12 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm">
                    <QrCode className="h-10 w-10 text-white/20" />
                  </div>
                  <p className="px-12 text-[14px] leading-relaxed font-medium text-white/40">
                    The camera interface will initialize once you begin the scan
                  </p>
                </div>
              )}
            </div>

            {/* STATUS & FEEDBACK */}
            <div className="text-center">
              {error ? (
                <p className="animate-in fade-in slide-in-from-top-1 text-[14px] font-bold text-rose-500">
                  {error}
                </p>
              ) : (
                <p className="text-[14px] font-medium text-gray-400">
                  Align the table QR code within the frame
                </p>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setScanning((prev) => !prev)}
                className={cn(
                  "h-16 w-full rounded-2xl text-[15px] font-bold tracking-tight transition-all active:scale-[0.98]",
                  scanning
                    ? "bg-rose-50 text-rose-600 shadow-none hover:bg-rose-100"
                    : "bg-black text-white shadow-xl shadow-black/10 hover:bg-gray-900"
                )}
              >
                {scanning ? (
                  <>Stop Scanning</>
                ) : (
                  <>
                    <Camera
                      className="mr-2 h-5 w-5 opacity-50"
                      strokeWidth={2.5}
                    />
                    Begin Scan
                  </>
                )}
              </Button>

              <button
                onClick={handleDialogClose}
                className="py-2 text-[14px] font-bold text-gray-400 transition-colors hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

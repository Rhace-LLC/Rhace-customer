import { useState, useRef } from "react";
import { X, Camera, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useZxing } from "react-zxing";

interface QRScanDialogProps {
  isOpen: boolean;
  onClose: (data: string) => void;
  onSuccess: (data: string) => void;
}

export function QRScanDialog({ isOpen, onClose, onSuccess }: QRScanDialogProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const beepRef = useRef<HTMLAudioElement | null>(null);

  const { ref: zxingRef } = useZxing({
    paused: !scanning,
    onDecodeResult: (result: any) => {
      const text: string = result.getText();
      if (!text) return;

      // 🔊 Play beep
      beepRef.current?.play().catch(() => {});

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Scan QR Code</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleDialogClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Point your camera at the QR code on your table
            </p>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-lg bg-black">
            {scanning ? (
              <video
                ref={zxingRef} // ✅ directly use the hook ref
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-gray-900/70 text-center text-white">
                <QrCode className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <p className="text-sm opacity-70">Camera view will appear here</p>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="text-muted-foreground text-center text-sm">
            <p>Position the QR code within the frame</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDialogClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => setScanning((prev) => !prev)}
              className="bg-primary hover:bg-primary/90 flex-1"
            >
              <Camera className="mr-2 h-4 w-4" />
              {scanning ? "Stop Scan" : "Start Scan"}
            </Button>
          </div>
        </div>

        {/* Beep sound */}
        <audio ref={beepRef} src="/beep.mp3" preload="auto" />
      </DialogContent>
    </Dialog>
  );
}

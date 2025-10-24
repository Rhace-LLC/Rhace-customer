import { useState } from "react";
import { X, Camera, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useZxing } from "react-zxing";

interface QRScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRScanDialog({ isOpen, onClose }: QRScanDialogProps) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { ref } = useZxing({
    paused: !scanning,
    onDecodeResult(result) {
      const text = result.getText();
      setScanResult(text);
      toast.success(`QR code detected: ${text}`);
      setScanning(false);
      onClose();
    },
    onError(err) {
      console.error(err);
      setError("Unable to access camera or scan QR code");
      toast.error("Unable to access camera or scan QR code");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Scan QR Code</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
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
            {!scanning ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-white bg-gray-900/70">
                <QrCode className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <p className="text-sm opacity-70">Camera view will appear here</p>
              </div>
            ) : (
              <video
                ref={ref}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          <div className="text-muted-foreground text-center text-sm">
            <p>Position the QR code within the frame</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
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
      </DialogContent>
    </Dialog>
  );
}

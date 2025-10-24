import { useState } from "react";
import { X, Camera, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { QrReader } from "react-qr-reader";

interface QRScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRScanDialog({ isOpen, onClose }: QRScanDialogProps) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleScan = (result: string | null) => {
    if (result) {
      setScanResult(result);
      setScanning(false);
      toast.success(`QR code detected: ${result}`);
      onClose();
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    toast.error("Unable to access camera or scan QR code");
  };

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
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={(result, error) => {
                  if (!!result) {
                    handleScan(result.getText());
                  }
                  if (!!error) {
                    console.warn(error);
                  }
                }}
                containerStyle={{ width: "100%", height: "100%" }}
                videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
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

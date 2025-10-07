import { useState } from "react";
import { X, Camera, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface QRScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRScanDialog({ isOpen, onClose }: QRScanDialogProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    // Mock QR scanning process
    setTimeout(() => {
      setIsScanning(false);
      toast.success("Successfully scanned, Table 2");
      onClose();
    }, 3000);
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
              Scan the QR code on your table to access the menu and place orders
            </p>
          </div>

          {/* Mock Camera View */}
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {isScanning ? (
              <div className="text-center">
                <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                <p className="text-muted-foreground text-sm">Scanning...</p>

                {/* Scanning overlay */}
                <div className="border-primary absolute inset-4 rounded-lg border-2">
                  <div className="border-primary absolute top-0 left-0 h-6 w-6 rounded-tl-lg border-t-4 border-l-4"></div>
                  <div className="border-primary absolute top-0 right-0 h-6 w-6 rounded-tr-lg border-t-4 border-r-4"></div>
                  <div className="border-primary absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-4 border-l-4"></div>
                  <div className="border-primary absolute right-0 bottom-0 h-6 w-6 rounded-br-lg border-r-4 border-b-4"></div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <QrCode className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <p className="text-muted-foreground text-sm">
                  Camera view will appear here
                </p>
              </div>
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
              onClick={handleStartScan}
              disabled={isScanning}
              className="bg-primary hover:bg-primary/90 flex-1"
            >
              <Camera className="mr-2 h-4 w-4" />
              {isScanning ? "Scanning..." : "Start Scan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

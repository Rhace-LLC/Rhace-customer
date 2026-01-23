import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import { useSetupContext } from "@/contexts/SetupContext";

interface ShareDineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDineDialog({ open, onOpenChange }: ShareDineDialogProps) {
  const { selectedRestaurant } = useSetupContext();

  const tableId = selectedRestaurant?.tableId;
  const restaurantId = selectedRestaurant?.restaurantId;

  const [copied, setCopied] = useState(false);

  const inviteLink = `https://bookies-customer.onrender.com?tid=${tableId}&rid=${restaurantId}&r=${selectedRestaurant?.restaurantName}&tno=${selectedRestaurant?.tableNo}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shareWhatsapp = () => {
    const message = `Join me at our table. ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] rounded-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Dine Invite</DialogTitle>
          <DialogDescription>
            Invite others to join your table.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Table Info */}
          <div className="space-y-1 rounded-md bg-gray-50 p-3 text-sm">
            <p>
              <span className="font-medium text-gray-500">Table No:</span>{" "}
              <span className="font-semibold">
                {selectedRestaurant?.tableNo}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={copyLink}
            >
              <Copy size={16} />
              {copied ? "Link Copied!" : "Copy Invite Link"}
            </Button>

            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              onClick={shareWhatsapp}
            >
              {/*
              <Whatsapp size={16} />*/}
              Share via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

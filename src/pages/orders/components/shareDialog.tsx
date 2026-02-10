"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Copy, Check, MessageCircle, Send } from "lucide-react";
import { useSetupContext } from "@/contexts/SetupContext";

interface ShareDineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDineDialog({ open, onOpenChange }: ShareDineDialogProps) {
  const { selectedRestaurant } = useSetupContext();
  const [copied, setCopied] = useState(false);

  const tableId = selectedRestaurant?.tableId;
  const restaurantId = selectedRestaurant?.restaurantId;
  const restaurantName = selectedRestaurant?.restaurantName;
  const tableNo = selectedRestaurant?.tableNo;

  const inviteLink = `https://bookies-customer.onrender.com?tid=${tableId}&rid=${restaurantId}&r=${restaurantName}&tno=${tableNo}`;
  const shareText = `Join me at ${restaurantName}, Table ${tableNo}! Use this link to join our dine-in session:`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${inviteLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const socialPlatforms = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={24} />,
      color: "bg-[#25D366]",
      href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + inviteLink)}`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] overflow-hidden rounded-[32px] border-none bg-white p-0 shadow-2xl">
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-blue-600/10" />

        <div className="p-8">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2">
                <Send size={18} className="text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight text-gray-900">
                  Invite Others
                </DialogTitle>
                <DialogDescription className="text-[12px] font-medium text-gray-400">
                  Share your table at{" "}
                  <span className="font-bold text-blue-600">
                    {restaurantName}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Table Badge */}
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
              Current Table
            </span>
            <span className="text-lg font-semibold text-gray-900">
              #{tableNo}
            </span>
          </div>

          {/* Social Grid */}
          <div className="mb-8 flex gap-4">
            {socialPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`h-12 w-12 ${platform.color} flex items-center justify-center rounded-2xl text-white shadow-lg transition-all group-hover:scale-110 group-active:scale-95`}
                >
                  {platform.icon}
                </div>
                <span className="text-[9px] font-bold tracking-tighter text-gray-400 uppercase">
                  {platform.name.split(" ")[0]}
                </span>
              </a>
            ))}
            {/* Link Section */}
            <div className="flex-1 space-y-3">
              <p className="ml-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                Copy Invite Link
              </p>
              <div className="relative flex items-center">
                <input
                  readOnly
                  value={inviteLink}
                  className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 pr-12 text-[12px] font-medium text-gray-500 outline-none"
                />
                <button
                  onClick={copyLink}
                  className={`absolute right-1.5 flex h-9 items-center gap-2 rounded-xl px-4 text-[10px] font-black tracking-widest uppercase shadow-sm transition-all ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-900 text-white hover:bg-black"
                  }`}
                >
                  {copied ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <Copy size={14} strokeWidth={3} />
                  )}
                  {copied ? "Done" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

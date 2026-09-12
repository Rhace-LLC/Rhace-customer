import { Camera, Smartphone } from "lucide-react";

interface QRScanPromptProps {
  onScan: () => void;
}

/** Empty state shown when no table has been selected yet. */
export function QRScanPrompt({ onScan }: QRScanPromptProps) {
  return (
    <div className="animate-in fade-in flex min-h-[70vh] flex-col items-center justify-center py-12 text-center duration-700">
      <div className="relative mb-10 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-50 opacity-75" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Smartphone size={32} strokeWidth={1.5} />
        </div>
      </div>

      <div className="space-y-4 px-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Ready to dine?
        </h2>
        <p className="mx-auto max-w-[280px] text-[15px] leading-relaxed font-medium text-gray-400">
          Scan the QR code on your table to unlock the menu and start your
          experience.
        </p>
      </div>

      <button
        onClick={onScan}
        className="mt-12 flex h-16 w-full max-w-[280px] items-center justify-center gap-3 rounded-4xl bg-black text-[15px] font-bold text-white shadow-2xl shadow-black/20 transition-all active:scale-95"
      >
        Scan Table QR
        <Camera size={18} className="opacity-50" />
      </button>
    </div>
  );
}

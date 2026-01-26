import { Calendar, Clock, Users, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ReservationForm } from "@/pages/reservations/createReservation";

interface BookingConfirmDialogProps {
  reservation: ReservationForm;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function BookingConfirmDialog({
  reservation,
  isOpen,
  onClose,
  onConfirm,
}: BookingConfirmDialogProps) {
  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] overflow-hidden rounded-[2.5rem] border-none p-0 shadow-2xl sm:max-w-[440px]">
        <div className="bg-white p-8 sm:p-10">
          
          {/* HEADER SECTON */}
          <DialogHeader className="mb-8">
            <div className="space-y-1">
              <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-blue-500">
                Final Step
              </p>
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Confirm Reservation
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-8">

            {/* DETAILS GRID */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-y border-gray-50 py-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Date</span>
                </div>
                <p className="text-[15px] font-bold text-gray-900">{reservation.date}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Time</span>
                </div>
                <p className="text-[15px] font-bold text-gray-900">{reservation.time}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Guests</span>
                </div>
                <p className="text-[15px] font-bold text-gray-900">
                   {reservation.party_size} {reservation.party_size === 1 ? "Person" : "People"}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Status</span>
                </div>
                <p className="text-[15px] font-bold capitalize text-gray-900">{reservation.status || 'Pending'}</p>
              </div>
            </div>

            {/* POLICY NOTES */}
            <div className="rounded-2xl bg-blue-50/30 p-5">
              <div className="mb-2 flex items-center gap-2 text-blue-600">
                <Info size={14} />
                <span className="text-[11px] font-bold uppercase tracking-widest">Policy Notes</span>
              </div>
              <ul className="space-y-1.5 text-[13px] font-medium leading-relaxed text-gray-500">
                <li className="flex items-start gap-2">• Arrive 10 minutes before your slot.</li>
                <li className="flex items-start gap-2">• Cancellations require 2h notice.</li>
              </ul>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="h-16 w-full rounded-2xl bg-black text-[15px] font-bold tracking-tight text-white shadow-2xl shadow-black/10 transition-all active:scale-[0.98]"
              >
                Confirm & Book Table
              </Button>
              <Button 
                variant="ghost" 
                onClick={onClose} 
                className="h-12 rounded-xl text-[14px] font-bold text-gray-400 hover:text-gray-900"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

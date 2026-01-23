import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ReservationForm } from "@/pages/reservations/createReservation";
import { useSetupContext } from "@/contexts/SetupContext";

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

  const setup = useSetupContext();
  const selectedRestaurant = setup.selectedRestaurant;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Reservation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <h3 className="mb-2 text-lg font-medium">
              Restaurant Venue - {selectedRestaurant?.restaurantName}
            </h3>
            <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              <span></span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="font-medium">{reservation.date}</p>
                <p className="text-muted-foreground text-sm">Date</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="font-medium">{reservation.time}</p>
                <p className="text-muted-foreground text-sm">Time</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="font-medium">
                  {reservation.party_size}{" "}
                  {reservation.party_size === 1 ? "guest" : "guests"}
                </p>
                <p className="text-muted-foreground text-sm">Party size</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-5 w-5 items-center justify-center rounded">
                <span className="text-xs font-bold text-white">T</span>
              </div>
              <div>
                <p className="font-medium">{reservation.status}</p>
                <p className="text-muted-foreground text-sm">
                  Reservation Status
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-5 w-5 items-center justify-center rounded">
                <span className="text-xs font-bold text-white">T</span>
              </div>
              <div>
                <p className="font-medium">Your table would be assigned</p>
                <p className="text-muted-foreground text-sm">-</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="text-muted-foreground space-y-1 text-sm">
            <p>• Please arrive 10 minutes before your reservation time</p>
            <p>• Cancellations must be made at least 2 hours in advance</p>
            <p>• Late arrivals may result in table reassignment</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className="bg-primary hover:bg-primary/90 flex-1"
            >
              Confirm Reservation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

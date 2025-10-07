import { useState } from "react";
import { Calendar, Users, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingConfirmDialog } from "@/components/dialogs/BookingConfirmDialog";
import { toast } from "sonner";

export function ReservationsPage() {
  const [pendingReservation, setPendingReservation] = useState(null);
  const handleBookTable = (reservation: any) => {
    setPendingReservation(reservation);
  };

  const handleConfirmReservation = () => {
    toast.success(
      "Reservation confirmed! You'll receive a confirmation email shortly."
    );
    setPendingReservation(null);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("7:00 PM");
  const [partySize, setPartySize] = useState(2);

  const timeSlots = [
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
  ];

  const upcomingReservations = [
    {
      id: "RES-001",
      date: "Dec 31, 2024",
      time: "7:30 PM",
      partySize: 4,
      table: "Table 12",
      status: "confirmed",
    },
    {
      id: "RES-002",
      date: "Jan 5, 2025",
      time: "6:00 PM",
      partySize: 2,
      table: "Table 8",
      status: "confirmed",
    },
  ];

  const handleBooking = () => {
    const reservation = {
      date: selectedDate.toLocaleDateString(),
      time: selectedTime,
      partySize,
      table: `Table ${Math.floor(Math.random() * 20) + 1}`,
    };
    handleBookTable(reservation);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-6 p-5">
        {/* New Reservation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Make a Reservation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Date
              </label>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const isSelected =
                    date.toDateString() === selectedDate.toDateString();

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`rounded-lg p-2 text-center text-sm ${
                        isSelected
                          ? "bg-primary text-white"
                          : "border border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-xs">
                        {date.toLocaleDateString("en", { weekday: "short" })}
                      </div>
                      <div>{date.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-lg p-2 text-center text-sm ${
                      selectedTime === time
                        ? "bg-primary text-white"
                        : "border border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Party Size */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Party Size
              </label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPartySize(Math.max(1, partySize - 1))}
                  disabled={partySize <= 1}
                >
                  -
                </Button>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">
                    {partySize} {partySize === 1 ? "guest" : "guests"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPartySize(partySize + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              className="bg-primary hover:bg-primary/90 w-full"
            >
              Book Table
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length > 0 ? (
              <div className="space-y-3">
                {upcomingReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span className="font-medium">{reservation.date}</span>
                      </div>
                      <Badge variant="secondary">{reservation.status}</Badge>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{reservation.partySize} guests</span>
                      </div>
                      <span>{reservation.table}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  No upcoming reservations
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <BookingConfirmDialog
        reservation={pendingReservation}
        isOpen={!!pendingReservation}
        onClose={() => setPendingReservation(null)}
        onConfirm={handleConfirmReservation}
      />
    </div>
  );
}

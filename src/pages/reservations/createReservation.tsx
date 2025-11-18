"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { BookingConfirmDialog } from "@/components/dialogs/BookingConfirmDialog";

export interface ReservationForm {
  party_size: number;
  date: string;
  time: string;
  status?: string;
}

interface CreateReservationProps {
  onSubmit: (reservation: ReservationForm) => void;
}

export function CreateReservation({ onSubmit }: CreateReservationProps) {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [partySize, setPartySize] = useState<number>(2);

  const [pendingReservation, setPendingReservation] =
    useState<ReservationForm | null>(null);

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
  ];

  const handleBooking = () => {
    if (!selectedTime) {
      alert("Please select a time.");
      return;
    }

    // ---- FORMAT DATE (YYYY-MM-DD) ----
    const formattedDate = selectedDate.toISOString().split("T")[0];

    // ---- FORMAT TIME (HH:mm) ----
    // If selectedTime is something like "7:30 PM", convert to 24-hr format
    const formattedTime = (() => {
      // If it's already 24hr format, return as is
      if (/^\d{2}:\d{2}$/.test(selectedTime)) return selectedTime;

      const date = new Date(`1970-01-01 ${selectedTime}`);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    })();

    const reservation: ReservationForm = {
      date: formattedDate,
      time: formattedTime,
      party_size: partySize,
      status: "pending",
    };

    setPendingReservation(reservation);
  };

  /** When user confirms in dialog */
  const handleConfirmReservation = () => {
    if (!pendingReservation) return;
    onSubmit(pendingReservation);
    setPendingReservation(null);
  };

  return (
    <>
      {/* Date Selection */}
      <div className="space-y-8 pt-8">
        <div>
          <label className="mb-2 block text-sm font-medium">Select Date</label>
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
                  className={`rounded-lg p-2 text-center text-xs ${
                    isSelected
                      ? "bg-primary text-white"
                      : "border border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="text-[11px]">
                    {date.toLocaleDateString("en", { weekday: "short" })}
                  </div>
                  <div className="font-medium">{date.getDate()}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">Select Time</label>
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
          <label className="mb-2 block text-sm font-medium">Party Size</label>
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

        {/* Submit */}
        <Button
          onClick={handleBooking}
          className="bg-primary hover:bg-primary/90 w-full"
        >
          Book Table
        </Button>
      </div>
      {/* CONFIRMATION DIALOG */}
      <BookingConfirmDialog
        reservation={pendingReservation!}
        isOpen={!!pendingReservation}
        onClose={() => setPendingReservation(null)}
        onConfirm={handleConfirmReservation}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { BookingConfirmDialog } from "@/components/dialogs/BookingConfirmDialog";
import { cn } from "@/lib/utils"; // Assuming you have this utility

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
  const [pendingReservation, setPendingReservation] = useState<ReservationForm | null>(null);

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "6:00 PM",
    "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  ];

  const handleBooking = () => {
    if (!selectedTime) return;
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const formattedTime = (() => {
      if (/^\d{2}:\d{2}$/.test(selectedTime)) return selectedTime;
      const date = new Date(`1970-01-01 ${selectedTime}`);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    })();

    setPendingReservation({
      date: formattedDate,
      time: formattedTime,
      party_size: partySize,
      status: "pending",
    });
  };

  return (
    <div className="mx-auto max-w-xl space-y-12 py-10 animate-in fade-in duration-700">
      
      {/* 1. DATE SELECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-blue-500">
            <Calendar size={16} strokeWidth={2.5} />
            <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Select Date</span>
          </div>
          <span className="text-[13px] font-bold text-gray-400">
            {selectedDate.toLocaleDateString("en", { month: 'long', year: 'numeric' })}
          </span>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {Array.from({ length: 14 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const isSelected = date.toDateString() === selectedDate.toDateString();

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex min-w-[70px] flex-col items-center justify-center rounded-[1.5rem] py-4 transition-all duration-300",
                  isSelected 
                    ? "bg-black text-white shadow-xl shadow-black/10 scale-105" 
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                )}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">
                  {date.toLocaleDateString("en", { weekday: "short" })}
                </span>
                <span className="mt-1 text-lg font-extrabold tracking-tight">
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. TIME SELECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1 text-blue-500">
          <Clock size={16} strokeWidth={2.5} />
          <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Available Slots</span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={cn(
                "h-12 rounded-2xl text-[13px] font-bold transition-all duration-300",
                selectedTime === time
                  ? "bg-black text-white shadow-lg"
                  : "bg-white ring-1 ring-gray-100 text-gray-600 hover:bg-gray-50 hover:ring-gray-200"
              )}
            >
              {time}
            </button>
          ))}
        </div>
      </section>

      {/* 3. PARTY SIZE & SUBMIT */}
      <section className="rounded-[2.5rem] bg-gray-50/50 p-8 sm:p-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h4 className="text-[18px] font-bold tracking-tight text-gray-900">Table for how many?</h4>
            <p className="text-[14px] font-medium text-gray-400">Specify your party size</p>
          </div>

          <div className="flex items-center justify-between gap-6 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-gray-50"
              onClick={() => setPartySize(Math.max(1, partySize - 1))}
              disabled={partySize <= 1}
            >
              <ChevronLeft size={18} />
            </Button>

            <div className="flex items-center gap-2 px-2">
              <Users className="h-4 w-4 text-blue-500" strokeWidth={2.5} />
              <span className="text-[16px] font-extrabold text-gray-900 min-w-[20px] text-center">
                {partySize}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-gray-50"
              onClick={() => setPartySize(partySize + 1)}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleBooking}
          disabled={!selectedTime}
          className="mt-10 h-16 w-full rounded-[1.5rem] bg-black text-[15px] font-bold tracking-tight text-white shadow-2xl shadow-black/10 transition-all active:scale-[0.98] disabled:bg-gray-200"
        >
          Complete Reservation
        </Button>
      </section>

      <BookingConfirmDialog
        reservation={pendingReservation!}
        isOpen={!!pendingReservation}
        onClose={() => setPendingReservation(null)}
        onConfirm={() => {
          onSubmit(pendingReservation!);
          setPendingReservation(null);
        }}
      />
    </div>
  );
}
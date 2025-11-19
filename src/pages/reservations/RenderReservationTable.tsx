"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReservationItem } from "@/api-services/order.service";

interface RenderReservationCardsProps {
  data: ReservationItem[];
}

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-500/80";
    case "confirmed":
      return "bg-green-600 hover:bg-green-600/80";
    case "cancelled":
      return "bg-red-600 hover:bg-red-600/80";
    case "completed":
      return "bg-blue-600 hover:bg-blue-600/80";
    default:
      return "bg-gray-500 hover:bg-gray-500/80";
  }
};

const ReservationCard: React.FC<{ reservation: ReservationItem }> = ({
  reservation: res,
}) => {
  const formattedDate = new Date(res.date).toLocaleDateString();
  const createdDate = new Date(res.date).toLocaleString();
  const customerFullName = `${res.customer.first_name} ${res.customer.last_name}`;

  return (
    <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="truncate text-xl font-bold">
          {customerFullName}
        </CardTitle>
        <Badge className={`${statusColor(res.status)} text-white`}>
          {res.status}
        </Badge>
      </CardHeader>

      <CardDescription className="px-6 pb-2 text-sm text-gray-500">
        <span className="font-semibold">{res.party_size} Guests</span>
        <span className="mx-2">•</span>
        {false ? `Table No` : "Unassigned"}
      </CardDescription>

      <Separator className="mx-auto w-[90%]" />

      <CardContent className="grid grid-cols-2 gap-y-2 pt-4 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500">Date & Time</span>
          <span className="font-medium">
            {formattedDate} at {res.time.substring(0, 5)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500">Phone</span>
          <span className="font-medium">{res.customer.phone}</span>
        </div>

        <div className="col-span-2 flex flex-col">
          <span className="text-gray-500">Booked On</span>
          <span className="text-xs text-gray-700">{createdDate}</span>
        </div>
      </CardContent>

      <div className="" />

      {/* Show cancellation reason if status is cancelled */}
      {res.status.toLowerCase() === "cancelled" && res.cancellation_reason && (
        <div className="mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <span className="font-semibold">Cancellation Reason:</span>{" "}
          {res.cancellation_reason}
        </div>
      )}
    </Card>
  );
};

// Main component to render the list of cards
const RenderReservationCards: React.FC<RenderReservationCardsProps> = ({
  data,
}) => {
  return (
    <div className="">
      {data.length === 0 ? (
        <div className="rounded-lg border bg-gray-50 py-12 text-center text-gray-500">
          <p className="text-lg font-medium">No reservations found.</p>
          <p className="text-sm">Check back later or adjust your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((res) => (
            <ReservationCard key={res.id} reservation={res} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderReservationCards;

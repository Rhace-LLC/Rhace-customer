"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Reservation } from "@/store/reservation.slice";

interface RenderReservationTable {
  data: Reservation[];
}

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-green-600";
    case "cancelled":
      return "bg-red-600";
    case "completed":
      return "bg-blue-600";
    default:
      return "bg-gray-500";
  }
};

const RenderReservationTable: React.FC<RenderReservationTable> = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Party Size</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-6 text-center text-gray-500">
                No reservations found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((res) => (
              <TableRow key={res.id}>
                <TableCell>{res.customer_name}</TableCell>
                <TableCell>{res.customer_phone}</TableCell>
                <TableCell>{res.party_size}</TableCell>
                <TableCell>{new Date(res.date).toLocaleDateString()}</TableCell>
                <TableCell>{res.time}</TableCell>

                <TableCell>
                  <Badge className={`${statusColor(res.status)}`}>
                    {res.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  {res.table_id ? `Table ${res.table_id}` : "—"}
                </TableCell>

                <TableCell>{new Date(res.created).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RenderReservationTable;

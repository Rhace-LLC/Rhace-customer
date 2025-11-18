import { useEffect, useMemo, useState } from "react";
import {  Users, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingConfirmDialog } from "@/components/dialogs/BookingConfirmDialog";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/contexts/AuthContext";
import { getReservations } from "@/api-services/order.service";
//import { updateReservationData } from "@/store/reservation.slice";
import { parseError } from "@/api-services/utils/parseError";
import { ContentHOC } from "@/components/nocontent";
import RenderReservationTable from "./RenderReservationTable";
import CreateReservationPrompt from "./createReservationPrompt";
import { Pagination } from "@/components/pagination";

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

  const handleBooking = () => {
    const reservation = {
      date: selectedDate.toLocaleDateString(),
      time: selectedTime,
      partySize,
      table: `Table ${Math.floor(Math.random() * 20) + 1}`,
    };
    handleBookTable(reservation);
  };


  // 
  const auth = useAuth()
  //const dispatch = useDispatch()
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const page_size = 8;
  const total_pages = Math.ceil(totalItems / page_size);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");


  const dataStore = useSelector((state: RootState) => state.reservations);
  const allData = dataStore.data;

  // ========== API Calls ==========
  const fetchAllData = async () => {
    try {
      setFetchLoading(true);
      setFetchError("");
      await getReservations(auth.token);
      //dispatch(updateReservationData({ key: String(page), data: res }));
      //dispatch(updateInventoryTotal({ data_total: 69 }));
      setTotalItems(69)
    } catch (error) {
      setFetchError(parseError(error) || "Failed to fetch ");
    } finally {
      setFetchLoading(false);
    }
  };
  // Normal Mode
  const toShow = useMemo(
    () => allData[String(page)] ?? [],
    [allData, page]
  );

  useEffect(()=>{
    fetchAllData()
  },[])


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-6 p-5">
        {/* New Reservation */}
        <CreateReservationPrompt onStart={()=> {}} />

        <Card hidden>
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
        <h3 className="text-lg font-semibold tracking-tighter">
              My Reservations</h3>
          <ContentHOC
          loading={fetchLoading}
          error={!!fetchError}
          noContent={toShow.length === 0}
          loadingText="Fetching Your Reservations. Please wait..."
          noContentMessage="No Reservations Found"
          noContentBtnText="Reload"
          noContentAction={fetchAllData}
          errMessage={fetchError}
          actionFn={fetchAllData}
        >
          <RenderReservationTable data={toShow} />
        </ContentHOC>
        <Pagination totalPages={total_pages} currentPage={page} onPageChange={(page)=>setPage(page)}></Pagination>
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

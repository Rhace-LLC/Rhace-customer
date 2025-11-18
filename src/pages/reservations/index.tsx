import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/contexts/AuthContext";
import {
  createReservation,
  getReservations,
} from "@/api-services/order.service";
//import { updateReservationData } from "@/store/reservation.slice";
import { parseError } from "@/api-services/utils/parseError";
import { ContentHOC } from "@/components/nocontent";
import RenderReservationTable from "./RenderReservationTable";
import CreateReservationPrompt from "./createReservationPrompt";
import { Pagination } from "@/components/pagination";
import GenericSheet from "@/components/generic_sheet_overlay";
import { CreateReservation, ReservationForm } from "./createReservation";
import { useLoading } from "@/contexts/LoadingContext";
import { toast } from "sonner";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";
export function ReservationsPage() {
  const { setLoading, setLoadingText } = useLoading();
  const [open, setOpen] = useState(false);
  const selectedRestaurant = useSelectedRestaurant();

  const auth = useAuth();
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
      setTotalItems(69);
    } catch (error) {
      setFetchError(parseError(error) || "Failed to fetch ");
    } finally {
      setFetchLoading(false);
    }
  };
  // Normal Mode
  const toShow = useMemo(() => allData[String(page)] ?? [], [allData, page]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSubmit = async (data: ReservationForm) => {
    try {
      setLoading(true);
      setLoadingText("Creating Your Reservation... Please wait");

      // Call API to create reservation
      const res = await createReservation(
        selectedRestaurant.restaurantId || "",
        data,
        auth.token
      );

      // Success toast
      toast.success("Reservation created successfully!");
    } catch (error: any) {
      // Parse and display error
      const errMessage = parseError(error) || "Failed to create reservation.";
      toast.error(errMessage);
      console.error("Reservation creation error:", error);
    } finally {
      // Reset loading state
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-6 p-5">
        {/* New Reservation */}
        <CreateReservationPrompt onStart={() => setOpen(true)} />

        {/* Upcoming Reservations */}
        <h3 className="text-lg font-semibold tracking-tighter">
          My Reservations
        </h3>
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
        <Pagination
          totalPages={total_pages}
          currentPage={page}
          onPageChange={(page) => setPage(page)}
        />
      </div>
      <GenericSheet
        open={open}
        onOpenChange={setOpen}
        title="Create Reservation"
        subtitle="Select your date, time and party size."
      >
        <CreateReservation
          onSubmit={(data) => {
            setOpen(false);
            handleSubmit(data);
          }}
        />
      </GenericSheet>
    </div>
  );
}

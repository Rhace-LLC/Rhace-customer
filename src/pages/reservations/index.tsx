import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/contexts/AuthContext";
import {
  createReservation,
  getReservations,
  Restaurant,
} from "@/api-services/order.service";
//import { updateReservationData } from "@/store/reservation.slice";
import { parseError } from "@/api-services/utils/parseError";
import { ContentHOC } from "@/components/nocontent";
import CreateReservationPrompt from "./createReservationPrompt";
import { Pagination } from "@/components/pagination";
import GenericSheet from "@/components/generic_sheet_overlay";
import { CreateReservation, ReservationForm } from "./createReservation";
import { useLoading } from "@/contexts/LoadingContext";
import { toast } from "sonner";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";
import {
  updateReservationData,
  updateReservationTotal,
} from "@/store/reservation.slice";
import RenderReservationCards from "./RenderReservationTable";
import { AllRestaurantsView } from "./AllRestaurantView";
import { RestaurantDetailView } from "./RestaurantDetailView";
import { RestaurantProfile } from "@/api-services/restaurantProfile";

type PageState =
  | "initialState"
  | "allRestaurantViewState"
  | "restaurantViewState";

export function ReservationsPage() {
  const [pageState, setPageState] = useState<PageState>("initialState");
  console.log("Page state:", pageState);
  const [activeRestaurant, setActiveRestaurant] = useState<RestaurantProfile | null>(
    null
  );

  const { setLoading, setLoadingText } = useLoading();
  const [open, setOpen] = useState(false);
  const selectedRestaurant = useSelectedRestaurant();

  const auth = useAuth();
  const dispatch = useDispatch();
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
      const res = await getReservations(auth.token);
      dispatch(updateReservationData({ key: String(page), data: res }));
      dispatch(updateReservationTotal({ data_total: 100 }));
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
    if (!activeRestaurant) {
      toast.error("No Restaurant Selected. Unable to proceed with booking");
      return;
    }
    try {
      setLoading(true);
      setLoadingText("Creating Your Reservation... Please wait");

      // Call API to create reservation
      const res = await createReservation(
        activeRestaurant?.id || "",
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

  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get("view");
      const restaurantId = searchParams.get("id");

      if (view === "restaurants") {
        setPageState("allRestaurantViewState");
        setActiveRestaurant(null);
      } else if (view === "restaurant" && restaurantId) {
        setPageState("restaurantViewState");
        // If activeRestaurant is not the same as query, reset or fetch
        setActiveRestaurant((prev) =>
          prev?.id === restaurantId ? prev : null
        );
        // TODO: optionally fetch restaurant by ID if needed
      } else {
        setPageState("initialState");
        setActiveRestaurant(null);
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    handleUrlChange(); // initialize state from current URL

    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const handleStartNewReservation = () => {
    const params = new URLSearchParams();
    params.set("view", "restaurants");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, "", newUrl);

    setPageState("allRestaurantViewState");
    setActiveRestaurant(null);
  };

  const handleSelectRestaurant = (restaurant: RestaurantProfile) => {
    const params = new URLSearchParams();
    params.set("view", "restaurant");
    params.set("id", restaurant.id);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, "", newUrl);

    setPageState("restaurantViewState");
    setActiveRestaurant(restaurant);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div
        className={`space-y-6 ${pageState !== "restaurantViewState" && "p-5"} `}
      >
        <div>
          {pageState === "initialState" && (
            <section>
              <CreateReservationPrompt onStart={handleStartNewReservation} />
              <div className="py-2" />

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
                <RenderReservationCards data={toShow} />
              </ContentHOC>
              <Pagination
                totalPages={total_pages}
                currentPage={page}
                onPageChange={(page) => setPage(page)}
              />
            </section>
          )}

          {pageState === "allRestaurantViewState" && (
            <AllRestaurantsView onSelectRestaurant={handleSelectRestaurant} />
          )}

          {pageState === "restaurantViewState" && activeRestaurant && (
            <RestaurantDetailView
              restaurant={activeRestaurant}
              onBookReservation={() => {
                setOpen(true);
              }}
            />
          )}
        </div>
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

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/contexts/AuthContext";
import { getReservations } from "@/api-services/order.service";
//import { updateReservationData } from "@/store/reservation.slice";
import { parseError } from "@/api-services/utils/parseError";
import { ContentHOC } from "@/components/nocontent";
import CreateReservationPrompt from "./createReservationPrompt";
import { Pagination } from "@/components/pagination";

import {
  updateReservationData,
  updateReservationTotal,
} from "@/store/reservation.slice";
import RenderReservationCards from "./RenderReservationTable";
import { Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ReservationsPage() {
  const navigate = useNavigate();
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
    if(auth.isAuthenticated){
      fetchAllData();
    }
  }, [auth]);

  const handleStartNewReservation = () => {
    navigate("/all-restaurants");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className={`space-y-6 p-4 pt-10`}>
        <section>
          <CreateReservationPrompt onStart={handleStartNewReservation} />
          <div className="py-2" />

          {/* Upcoming Reservations */}
          <h3 className="text-lg font-semibold tracking-tighter">
            My Reservations
          </h3>
          {auth.isAuthenticated ? (
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
          ) : (
            <div className="mt-6 rounded-xl border border-gray-500 bg-white p-6 text-center shadow-sm">
              <div className="mb-3 flex justify-center">
                <Lock className="h-10 w-10 text-gray-500" />
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                Login Required
              </h2>

              <p className="mt-2 px-4 text-sm text-gray-600">
                You need to be logged in to view your previous reservations.
                Please sign in to continue.
              </p>

              <div className="mt-5">
                <Button
                  onClick={() => navigate("/login?next=reservations")}
                  className="flex w-full items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Login Now
                </Button>
              </div>
            </div>
          )}
          <Pagination
            totalPages={total_pages}
            currentPage={page}
            onPageChange={(page) => setPage(page)}
          />
        </section>
      </div>
    </div>
  );
}

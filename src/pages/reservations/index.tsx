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
import { useNavigate } from "react-router-dom";

export function ReservationsPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

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
    } catch (error) {
      setFetchError(parseError(error) || "Failed to fetch ");
    } finally {
      setFetchLoading(false);
    }
  };

  // Normal Mode
  const toShow = useMemo(() => allData[String(page)] ?? [], [allData, page]);

  useEffect(() => {
    if (auth.isAuthenticated) {
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
            totalPages={page+1}
            currentPage={page}
            onPageChange={(page) => setPage(page)}
          />
        </section>
      </div>
    </div>
  );
}

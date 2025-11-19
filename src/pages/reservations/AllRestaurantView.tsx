import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRestaurantData } from "./useRestaurantData";
import { ContentHOC } from "@/components/nocontent";
import { Pagination } from "@/components/pagination";
import { Restaurant } from "@/api-services/order.service";

interface AllRestaurantsViewProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const AllRestaurantsView: React.FC<AllRestaurantsViewProps> = ({
  onSelectRestaurant,
}) => {
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const dataStore = useSelector((state: RootState) => state.restaurants);
  const allData = dataStore.data;
  const totalItems = dataStore.total;

  const total_pages = Math.ceil(totalItems / pageSize);

  const { fetchAllData, loading, error } = useRestaurantData(page);

  // Fetch data for current page if not already loaded
  useEffect(() => {
    if (!allData[String(page)]) {
      fetchAllData();
    }
  }, [page, allData]);

  // Restaurants to show on current page
  const toShow = allData[String(page)] ?? [];

  return (
    <>
      <ContentHOC
        loading={loading}
        error={!!error}
        noContent={toShow.length === 0}
        loadingText="Fetching Restaurants..."
        noContentMessage="No Restaurants Found"
        noContentBtnText="Reload"
        noContentAction={fetchAllData}
        errMessage={error || undefined}
        actionFn={fetchAllData}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {toShow.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => onSelectRestaurant(restaurant)}
              className="cursor-pointer rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
            >
              <h4 className="truncate font-semibold text-gray-800">
                {restaurant.name}
              </h4>
              {restaurant.address && (
                <p className="truncate text-sm text-gray-500">
                  {restaurant.address}
                </p>
              )}
              {restaurant.phone && (
                <p className="text-sm text-gray-400">{restaurant.phone}</p>
              )}
            </div>
          ))}
        </div>
      </ContentHOC>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={total_pages}
        onPageChange={(p) => setPage(p)}
      />
    </>
  );
};

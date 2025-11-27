import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRestaurantData } from "./useRestaurantData";
import { ContentHOC } from "@/components/nocontent";
import { Pagination } from "@/components/pagination";
import { RestaurantProfile } from "@/api-services/restaurantProfile";
import RestaurantCard from "./RestaurantView";

interface AllRestaurantsViewProps {
  onSelectRestaurant: (restaurant: RestaurantProfile) => void;
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Discover Amazing Restaurants
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Browse curated dining spots, explore menus, and find the perfect place
          to enjoy your next meal.
        </p>
      </div>
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
          {toShow.map((restaurant, index) => (
            <div key={index}>
              <RestaurantCard
                restaurant={restaurant}
                onRestaurantView={() => onSelectRestaurant(restaurant)}
              />
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

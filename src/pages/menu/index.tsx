import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getAllCategories } from "@/api-services/menu.service";
import { updatMenuCategoryData } from "@/store/menu.slice";
import { parseError } from "@/api-services/utils/parseError";
import { ContentHOC } from "@/components/nocontent";
import { RenderMenuCategory } from "./rendercat";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";

export function MenuPage() {
  const auth = useAuth();
  const selectedRestaurant = useSelectedRestaurant()
  const dispatch = useDispatch();

  const dataStore = useSelector((state: RootState) => state.menu);
  const allCatData = dataStore.categoryData;

  const [fetchCategoryLoading, setFetchCategoryLoading] = useState(false);
  const [fetchCategoryError, setFetchCategoryError] = useState("");

  const fetchCategory = async () => {
    try {
      setFetchCategoryLoading(true);
      setFetchCategoryError("");

      const response = await getAllCategories(selectedRestaurant.restaurantId || "",auth.token);
      console.log("Menu Data Response:", response);
      dispatch(updatMenuCategoryData(response));
    } catch (error: any) {
      console.error("Fetch Category Error:", error);
      const errorMessage = parseError(error) || "Failed to fetch categories.";
      setFetchCategoryError(errorMessage);
    } finally {
      setFetchCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (allCatData.length == 0) {
      fetchCategory();
    }
  }, []);

  return (
    <div
      className={`min-h-screen bg-gray-50 pb-20 ${fetchCategoryLoading || fetchCategoryError ? "p-6 pt-12" : ""}`}
    >
      <ContentHOC
        loading={fetchCategoryLoading}
        error={!!fetchCategoryError}
        noContent={allCatData.length === 0}
        loadingText="Fetching Categories. Please Wait."
        noContentMessage="Reload Categorie List"
        noContentBtnText="Reload Categories"
        noContentAction={fetchCategory}
        errMessage={fetchCategoryError || "Failed to load borrowers."}
        actionFn={fetchCategory}
      >
        <RenderMenuCategory />
      </ContentHOC>
    </div>
  );
}

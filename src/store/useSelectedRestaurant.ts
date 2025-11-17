import { useSelector } from "react-redux";
import { RootState } from "./store";

// Hook to get the selected restaurant from the Redux store
export const useSelectedRestaurant = () => {
  const selectedRestaurant = useSelector(
    (state: RootState) => state.selectedRestaurant
  );

  return selectedRestaurant;
};

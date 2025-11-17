import { setSelection } from "@/store/restaurant_selection.slice";
import { useDispatch } from "react-redux";

export function parseAndDispatchSelection(fullUrl: string) {
    const dispatch = useDispatch()
  try {
    // Create URL instance for robust parsing
    const url = new URL(fullUrl);

    const tableId = url.searchParams.get("tid") || "";
    const restaurantId = url.searchParams.get("rid") || "";
    const restaurantName = url.searchParams.get("r") || "";

    // Only dispatch if values exist
    if (tableId && restaurantId && restaurantName) {
      dispatch(
        setSelection({
          tableId,
          restaurantId,
          restaurantName,
        })
      )
      return {
        tableId,
        restaurantId,
        restaurantName,
      };
    }

    return null; // invalid / incomplete params
  } catch (error) {
    console.error("Invalid URL passed to parseAndDispatchSelection:", error)
    return null;
  }
}

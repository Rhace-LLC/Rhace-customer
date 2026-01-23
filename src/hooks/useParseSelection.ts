// hooks/useParseSelection.ts

import { useSetupContext } from "@/contexts/SetupContext";

export interface ParsedSelection {
  tableId: string;
  restaurantId: string;
  restaurantName: string;
  tableNo: string;
}

export const useParseSelection = () => {
  const setup = useSetupContext();

  const parseAndSetSelection = (fullUrl: string): ParsedSelection | null => {
    try {
      const url = new URL(fullUrl);

      const tableId = url.searchParams.get("tid") || "";
      const tableNo = url.searchParams.get("tno") || "";
      const restaurantId = url.searchParams.get("rid") || "";
      const restaurantName = url.searchParams.get("r") || "";

      if (tableId && restaurantId && restaurantName) {
        const selection = {
          tableId,
          restaurantId,
          restaurantName,
          tableNo,
        };

        setup.setSelectedRestaurant(selection);
        return selection;
      }

      return null;
    } catch (error) {
      console.error("Invalid URL passed to parseAndSetSelection:", error);
      return null;
    }
  };

  return {
    parseAndSetSelection,
  };
};

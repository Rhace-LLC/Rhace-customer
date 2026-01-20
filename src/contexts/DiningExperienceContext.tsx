import { sitAtTable } from "@/api-services/menu.service";
import { RootState } from "@/store/store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "./AuthContext";

export type DiningExperience = "personal" | "group";

interface DiningExperienceContextValue {
  preferredDiningExperience: DiningExperience | null;
  setPreferredDiningExperience: (value: DiningExperience) => void;
  resetDiningExperience: () => void;
  shouldPrompt: boolean;
  setShouldPrompt: (val: boolean) => void;
}

const DiningExperienceContext =
  createContext<DiningExperienceContextValue | null>(null);

export const DiningExperienceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = useAuth();
  const selectedRestaurant = useSelector(
    (state: RootState) => state.selectedRestaurant
  );
  const restaurantId = selectedRestaurant.restaurantId;

  const [preferredDiningExperience, setPreferredDiningExperience] =
    useState<DiningExperience | null>(null);

  const [shouldPrompt, setShouldPrompt] = useState(false);

  const [hasSeatedUser, setHasSeatedUser] = useState(false);

  const seatUserToTable = async () => {
    try {
      await sitAtTable(auth.token, {
        table_id: selectedRestaurant.tableId || "",
        access_code: selectedRestaurant.access_code || "",
      });
      setHasSeatedUser(true);
    } catch (err) {
      // handle error
    }
  };

  useEffect(() => {
    if (restaurantId && !preferredDiningExperience && auth.isAuthenticated) {
      setShouldPrompt(true);
    }
  }, [restaurantId, preferredDiningExperience, auth]);

  useEffect(() => {
    if (
      restaurantId &&
      preferredDiningExperience === "group" &&
      !shouldPrompt &&
      !hasSeatedUser
    ) {
      seatUserToTable();
    }
  }, [restaurantId, preferredDiningExperience, shouldPrompt, hasSeatedUser]);

  const resetDiningExperience = () => {
    setPreferredDiningExperience(null);
    setShouldPrompt(false);
  };

  return (
    <DiningExperienceContext.Provider
      value={{
        preferredDiningExperience,
        setPreferredDiningExperience,
        resetDiningExperience,
        shouldPrompt,
        setShouldPrompt,
      }}
    >
      {children}
    </DiningExperienceContext.Provider>
  );
};

export const useDiningExperience = () => {
  const ctx = useContext(DiningExperienceContext);
  if (!ctx) {
    throw new Error(
      "useDiningExperience must be used within DiningExperienceProvider"
    );
  }
  return ctx;
};

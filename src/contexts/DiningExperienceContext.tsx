import { RootState } from "@/store/store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  const restaurantId = useSelector(
    (state: RootState) => state.selectedRestaurant.restaurantId
  );

  const [preferredDiningExperience, setPreferredDiningExperience] =
    useState<DiningExperience | null>(null);

  const [shouldPrompt, setShouldPrompt] = useState(false);

  // Trigger prompt when QR scan succeeds (restaurantId becomes available)
  useEffect(() => {
    if (restaurantId && !preferredDiningExperience) {
      setShouldPrompt(true);
    }
  }, [restaurantId, preferredDiningExperience]);

  const resetDiningExperience = () => {
    setPreferredDiningExperience(null);
    setShouldPrompt(false);
  };

  console.log("shouldPromptInContext", shouldPrompt, preferredDiningExperience);

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

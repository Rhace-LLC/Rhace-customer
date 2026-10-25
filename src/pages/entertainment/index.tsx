import { useState } from "react";
import { useSetupContext } from "@/contexts/SetupContext";
import { BuildYourDishModal } from "./_components/BuildYourDishModal";
import { DidYouKnowCarousel } from "./_components/DidYouKnowCarousel";
import { FunArea } from "./_components/FunArea";
import { GamesSection } from "./_components/GamesSection";

/**
 * Entertainment tab: games, food facts and the Build Your Own Dish activity.
 * Guests land here from the bottom bar or from the "play while you wait"
 * prompt after placing an order.
 */
export function EntertainmentPage() {
  const restaurantId = useSetupContext().selectedRestaurant?.restaurantId;
  const [isBuildDishOpen, setIsBuildDishOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-65px)] bg-white selection:bg-blue-100">
      {/* Sections carry their own mt-12; the first one sits under the header instead. */}
      <div className="mx-auto max-w-2xl px-6 pt-10 pb-24 [&>section:first-of-type]:mt-0">
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Entertainment
          </h1>
          <p className="mt-1 text-[14px] font-medium text-gray-500">
            Games and fun while you wait for your food.
          </p>
        </header>

        <GamesSection />

        {/* Build Your Dish suggests dishes from the current restaurant's menu. */}
        {restaurantId && (
          <>
            <FunArea onBuildDish={() => setIsBuildDishOpen(true)} />
            <BuildYourDishModal
              open={isBuildDishOpen}
              onOpenChange={setIsBuildDishOpen}
              restaurantId={restaurantId}
            />
          </>
        )}

        <DidYouKnowCarousel />
      </div>
    </div>
  );
}

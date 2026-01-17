import { useDiningExperience } from "@/contexts/DiningExperienceContext";
import PersonalDineOrder from "./PersonalDinerOrder";
import GroupDineOrder from "./GroupDineOrder";

export function OrdersPage() {
  const dinePreference = useDiningExperience();
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-5 p-4 pt-8">
        {dinePreference.preferredDiningExperience == "personal" && (
          <PersonalDineOrder />
        )}

        {dinePreference.preferredDiningExperience == "group" && (
          <GroupDineOrder />
        )}
      </div>
    </div>
  );
}

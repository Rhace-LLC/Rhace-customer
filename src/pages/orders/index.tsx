import PersonalDineOrder from "./PersonalDinerOrder";
import GroupDineOrder from "./GroupDineOrder";
import { useSetupContext } from "@/contexts/SetupContext";

export function OrdersPage() {
  const { preferredDiningExperience } = useSetupContext();
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-5 p-4 pt-8">
        {preferredDiningExperience == "group" && !!preferredDiningExperience ? (
          <GroupDineOrder />
        ) : (
          <PersonalDineOrder />
        )}
      </div>
    </div>
  );
}

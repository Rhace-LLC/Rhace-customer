import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { RenderMenuCategoryDishes } from "./renderdishes";

export const RenderMenuCategory = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([
    "appetizers",
  ]);
  const dataStore = useSelector((state: RootState) => state.menu);
  const allCatData = dataStore.categoryData;

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="my-3 border border-b border-gray-100" />
      {allCatData.map((category) => (
        <div key={category.id}>
          <Collapsible
            open={openCategories.includes(String(category.id))}
            onOpenChange={() => toggleCategory(String(category.id))}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-t-lg p-4 text-left hover:bg-gray-50">
              <h3 className="font-medium">{category.name}</h3>
              {openCategories.includes(String(category.id)) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4">
              <RenderMenuCategoryDishes categoryId={category.id} />
            </CollapsibleContent>
          </Collapsible>
          <div className="my-5 border border-b border-gray-100" />
        </div>
      ))}
    </div>
  );
};

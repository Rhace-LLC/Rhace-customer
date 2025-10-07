import { useState } from "react";
import { ChevronDown, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DishDetailSheet } from "@/components/sheets/DishDetailSheet";
import { ImageWithFallback } from "@/components/imagewithfallback/ImageWithFallback";
import { toast } from "sonner";

export function MenuPage() {
  const [openCategories, setOpenCategories] = useState<string[]>([
    "appetizers",
  ]);

  const handleDishClick = (dish: any) => {
    setSelectedDish(dish);
  };
  const [selectedDish, setSelectedDish] = useState(null);
  const handleAddToCart = (dish: any, quantity: number, addons: string[]) => {
    toast.success(
      `Added ${quantity}x ${dish.name} Plus these addons: ${addons.join("-")} to cart!`
    );
  };

  const categories = [
    {
      id: "appetizers",
      name: "Appetizers",
      dishes: [
        {
          id: 1,
          name: "Truffle Arancini",
          price: 16,
          description: "Crispy risotto balls with truffle oil",
          image:
            "https://images.unsplash.com/photo-1646473267592-61e8630367bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjByZXN0YXVyYW50JTIwZm9vZCUyMGRpc2hlc3xlbnwxfHx8fDE3NTkyMTk3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
          rating: 4.6,
        },
        {
          id: 2,
          name: "Burrata Caprese",
          price: 18,
          description: "Fresh burrata with heirloom tomatoes",
          image:
            "https://images.unsplash.com/photo-1646473267592-61e8630367bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjByZXN0YXVyYW50JTIwZm9vZCUyMGRpc2hlc3xlbnwxfHx8fDE3NTkyMTk3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
          rating: 4.8,
        },
      ],
    },
    {
      id: "mains",
      name: "Main Courses",
      dishes: [
        {
          id: 3,
          name: "Truffle Pasta",
          price: 28,
          description: "Handmade pasta with black truffle and parmesan",
          image:
            "https://images.unsplash.com/photo-1667473775795-41f69ae72c44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGFzdGElMjBkaXNofGVufDF8fHx8MTc1OTE0MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080",
          rating: 4.9,
        },
        {
          id: 4,
          name: "Grilled Salmon",
          price: 32,
          description: "Fresh Atlantic salmon with seasonal vegetables",
          image:
            "https://images.unsplash.com/photo-1758157836016-3f3fbc5bf796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9uJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTkxNjkxNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
          rating: 4.7,
        },
        {
          id: 5,
          name: "Ribeye Steak",
          price: 45,
          description: "Prime ribeye with garlic butter and herbs",
          image:
            "https://images.unsplash.com/photo-1646473267592-61e8630367bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjByZXN0YXVyYW50JTIwZm9vZCUyMGRpc2hlc3xlbnwxfHx8fDE3NTkyMTk3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
          rating: 4.8,
        },
      ],
    },
    {
      id: "desserts",
      name: "Desserts",
      dishes: [
        {
          id: 6,
          name: "Tiramisu",
          price: 12,
          description: "Classic Italian tiramisu with coffee",
          image:
            "https://images.unsplash.com/photo-1646473267592-61e8630367bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjByZXN0YXVyYW50JTIwZm9vZCUyMGRpc2hlc3xlbnwxfHx8fDE3NTkyMTk3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
          rating: 4.5,
        },
      ],
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-4 p-5">
        {categories.map((category) => (
          <Card key={category.id}>
            <Collapsible
              open={openCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-t-lg p-4 text-left hover:bg-gray-50">
                <h3 className="font-medium">{category.name}</h3>
                {openCategories.includes(category.id) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {category.dishes.map((dish) => (
                      <div
                        key={dish.id}
                        onClick={() => handleDishClick(dish)}
                        className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                      >
                        <ImageWithFallback
                          src={dish.image}
                          alt={dish.name}
                          className="mb-3 h-32 w-full rounded-lg object-cover"
                        />
                        <h4 className="mb-1 font-medium">{dish.name}</h4>
                        <p className="text-muted-foreground mb-2 text-sm">
                          {dish.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">${dish.price}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{dish.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Sheets and Dialogs */}
      <DishDetailSheet
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

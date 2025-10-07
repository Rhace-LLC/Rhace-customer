import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { ImageWithFallback } from "../imagewithfallback/ImageWithFallback";

interface DishDetailSheetProps {
  dish: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: any, quantity: number, addons: string[]) => void;
}

export function DishDetailSheet({
  dish,
  isOpen,
  onClose,
  onAddToCart,
}: DishDetailSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const addons = [
    { id: "extra-cheese", name: "Extra Cheese", price: 3 },
    { id: "avocado", name: "Avocado", price: 4 },
    { id: "bacon", name: "Bacon", price: 4 },
    { id: "truffle-oil", name: "Truffle Oil", price: 6 },
  ];

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getTotalPrice = () => {
    const addonPrice = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    return (dish.price + addonPrice) * quantity;
  };

  const handleAddToCart = () => {
    onAddToCart(dish, quantity, selectedAddons);
    onClose();
    setQuantity(1);
    setSelectedAddons([]);
  };

  if (!dish) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Dish Details</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-4">
          <ImageWithFallback
            src={dish.image}
            alt={dish.name}
            className="h-48 w-full rounded-lg object-cover"
          />

          <div>
            <h2 className="mb-2 text-xl font-medium">{dish.name}</h2>
            <p className="text-muted-foreground mb-3">{dish.description}</p>
            <Badge variant="secondary">Rating: {dish.rating} ⭐</Badge>
          </div>

          <div>
            <h3 className="mb-3 font-medium">Add-ons</h3>
            <div className="space-y-2">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={addon.id}
                      checked={selectedAddons.includes(addon.id)}
                      onCheckedChange={() => handleAddonToggle(addon.id)}
                    />
                    <label
                      htmlFor={addon.id}
                      className="cursor-pointer text-sm"
                    >
                      {addon.name}
                    </label>
                  </div>
                  <span className="text-sm font-medium">+${addon.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-medium">Quantity</h3>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-lg font-medium">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-medium">Total</span>
              <span className="text-xl font-bold">${getTotalPrice()}</span>
            </div>
            <Button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary/90 w-full"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

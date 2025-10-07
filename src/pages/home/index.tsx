import { QrCode, Star, Clock, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useState } from "react";
import { QRScanDialog } from "@/components/dialogs/QRScanDialog";

export function HomePage() {
  const [isQRScanOpen, setIsQRScanOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  console.log("selected dish", selectedDish);

  const handleQRScan = () => {
    setIsQRScanOpen(true);
  };
  const handleDishClick = (dish: any) => {
    setSelectedDish(dish);
  };

  const todaysSpecials = [
    {
      id: 1,
      name: "Truffle Pasta",
      price: 28,
      description: "Handmade pasta with black truffle and parmesan",
      image:
        "https://images.unsplash.com/photo-1667473775795-41f69ae72c44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGFzdGElMjBkaXNofGVufDF8fHx8MTc1OTE0MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Grilled Salmon",
      price: 32,
      description: "Fresh Atlantic salmon with seasonal vegetables",
      image:
        "https://images.unsplash.com/photo-1758157836016-3f3fbc5bf796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9uJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTkxNjkxNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.7,
    },
  ];

  const recentOrders = [
    {
      id: 1,
      name: "Margherita Pizza",
      date: "2 days ago",
      status: "delivered",
    },
    { id: 2, name: "Caesar Salad", date: "1 week ago", status: "delivered" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-6 p-5">
        {/* Welcome Section */}

        <QRScanDialog
          isOpen={isQRScanOpen}
          onClose={() => setIsQRScanOpen(false)}
        />
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl">Welcome back!</h2>
          <p className="text-muted-foreground mb-4">
            Ready to order something delicious?
          </p>
          <Button
            onClick={handleQRScan}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            <QrCode className="mr-2 h-5 w-5" />
            Scan QR Code
          </Button>
        </div>

        {/* Today's Specials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Today's Specials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysSpecials.map((dish) => (
              <div
                key={dish.id}
                onClick={() => handleDishClick(dish)}
                className="flex cursor-pointer gap-4 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{dish.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {dish.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-medium">${dish.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{dish.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div>
                  <h3 className="font-medium">{order.name}</h3>
                  <p className="text-muted-foreground text-sm">{order.date}</p>
                </div>
                <span className="text-sm font-medium text-green-600 capitalize">
                  {order.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Floating QR Button */}
      <Button
        onClick={handleQRScan}
        size="icon"
        className="bg-primary hover:bg-primary/90 fixed right-5 bottom-24 z-40 h-14 w-14 rounded-full shadow-lg"
      >
        <QrCode className="h-6 w-6" />
      </Button>
    </div>
  );
}

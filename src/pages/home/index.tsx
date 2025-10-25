import { QrCode, Star, Clock, ChefHat,  CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { QRScanDialog } from "@/components/dialogs/QRScanDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  const [isQRScanOpen, setIsQRScanOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [assignedTable, setAssignedTable] = useState<number | null>(null);
  const handleQRScan = () => setIsQRScanOpen(true);

  console.log({ selectedDish });

  const handleScanSuccess = (data: string) => {
    try {
      const parsed = JSON.parse(data);

      if (parsed && parsed.tableId) {
        setAssignedTable(parsed.tableId);
        console.log("✅ Scan successful:", data, parsed);
        setSelectedDish(data);
        toast.success(`Welcome! You're now seated at Table ${parsed.tableId}`);
      } else {
        console.warn("⚠️ QR data missing tableId:", parsed);
        toast.error("Invalid QR data — no table information found.");
      }
    } catch (error) {
      console.error("❌ Failed to parse QR code data:", error);
      toast.error("Invalid QR code. Please try again.");
    } finally {
      setIsQRScanOpen(false);
    }
  };

  const handleDialogClose = (data: string) => {
    console.log("Dialog closed:", data);
    setIsQRScanOpen(false);
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
        {/* QR Scanner Dialog */}
        <QRScanDialog
          isOpen={isQRScanOpen}
          onClose={handleDialogClose}
          onSuccess={handleScanSuccess}
        />

        {/* Welcome Section */}
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">
            {assignedTable ? "Welcome!" : "Welcome back!"}
          </h2>

          {!assignedTable ? (
            <>
              <p className="text-muted-foreground mb-4">
                Ready to order something delicious?
              </p>
              <Button
                onClick={handleQRScan}
                className="bg-primary hover:bg-primary/80 w-full cursor-pointer"
              >
                <QrCode className="mr-2 h-5 w-5" />
                Scan QR Code
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground">
                  You’re now seated at{" "}
                  <span className="text-primary font-semibold">
                    Table {assignedTable}
                  </span>
                  .
                </p>
                <p className="text-muted-foreground mt-1">
                  A waiter will be over shortly to take your order, or you can
                  place your order right here in the app.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  className="hidden flex-1"
                  onClick={() => toast.info("A waiter has been notified!")}
                >
                  Notify Waiter
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/80 h-11 flex-1 cursor-pointer rounded-[9px]"
                  onClick={() => {
                    navigate(`/menu`);
                  }}
                >
                  Browse Menu
                </Button>
              </div>
            </div>
          )}
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
            <div className="my-5 border border-b border-gray-100" />
            {todaysSpecials.map((dish, index) => (
              <div key={index}>
                <div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish.name)}
                  className="flex cursor-pointer items-center gap-4 rounded-lg transition-colors hover:bg-gray-50"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-20 w-20 rounded-lg object-cover"
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
                <div className="my-5 border border-b border-gray-100" />
              </div>
            ))}
            <Button
              className="bg-primary hover:bg-primary/80 h-11 w-full cursor-pointer rounded-[9px]"
              onClick={() => {
                navigate(`/menu`);
              }}
            >
              View Full Menu
            </Button>
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
            <div className="my-5 border border-b border-gray-100" />
            {recentOrders.map((order, index) => (
              <div key={index}>
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-2 py-4"
                >
                  <div>
                    <h3 className="font-medium">{order.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {order.date}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-green-600 capitalize">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                </div>

                <div className="my-5 border border-b border-gray-100" />
              </div>
            ))}
            <Button
              className="bg-primary hover:bg-primary/80 h-11 w-full cursor-pointer rounded-[9px]"
              onClick={() => {
                navigate(`/orders`);
              }}
            >
              View Your Order History
            </Button>
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

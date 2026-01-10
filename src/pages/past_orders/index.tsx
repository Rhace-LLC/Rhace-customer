import { LogIn, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderDetailSheet } from "@/components/sheets/OrderDetailSheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { getOrders, getOrdersById, Order } from "@/api-services/order.service";
import { useAuth } from "@/contexts/AuthContext";
import { ContentHOC } from "@/components/nocontent";
import { OrdersOverview } from "../orders/OrderCard";

export function PastOrders() {
  const auth = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  const handleCancelOrder = (orderId: string) => {
    toast.success(`Order ${orderId} has been cancelled.`);
  };

  const [fetchUserOrdersLoading, setFetchUserOrdersLoading] = useState(false);
  const [fetchUserOrdersError, setFetchUserOrdersError] = useState("");
  const [userOrders, setUserOrders] = useState<Order[]>([]); // ideally use OrderResponse[]

  // ✅ Fetch User Orders
  const fetchUserOrders = async () => {
    try {
      setFetchUserOrdersLoading(true);
      setFetchUserOrdersError("");

      const response = await getOrders(auth.token);

      // Adjust based on your API response structure
      setUserOrders(response);
    } catch (error: any) {
      setFetchUserOrdersError(error.message || "Failed to fetch user orders");
    } finally {
      setFetchUserOrdersLoading(false);
    }
  };

  const fetchOrderById = async (orderId: number) => {
    try {
      const order = await getOrdersById(orderId, auth.token);

      // Replace the updated order inside the array
      setUserOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === order.id ? order : o))
      );
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-5">
        {auth.isAuthenticated ? (
          <ContentHOC
            loading={fetchUserOrdersLoading}
            error={!!fetchUserOrdersError}
            noContent={userOrders?.length === 0}
            loadingText="Fetching Your Orders. Please Wait."
            noContentMessage="Reload Your Orders List"
            noContentBtnText="Reload Your Orders"
            noContentAction={fetchUserOrders}
            errMessage={fetchUserOrdersError || "Failed to load borrowers."}
            actionFn={fetchUserOrders}
          >
            <OrdersOverview
              userOrders={userOrders}
              onOrderClick={(order) => setSelectedOrder(order)}
              refetchOrderById={(order_id) => fetchOrderById(order_id)}
            />
          </ContentHOC>
        ) : (
          <div className="mt-6 rounded-xl border bg-white p-6 text-center shadow-sm">
            <div className="mb-3 flex justify-center">
              <Lock className="h-10 w-10 text-gray-500" />
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Login Required
            </h2>

            <p className="mt-2 px-4 text-sm text-gray-600">
              You need to be logged in to view your order history. Please sign
              in to continue.
            </p>

            <div className="mt-5">
              <Button
                onClick={() => navigate("/login?next=orders")}
                className="flex w-full items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Login Now
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailSheet
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
}

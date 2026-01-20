import { useAuth } from "@/contexts/AuthContext";
import { useTableOrder } from "@/hooks/useTableOrder";
import { OrderCard } from "./activeOrderPanel";

const MyTableOrders = () => {
  const auth = useAuth();
  const { tableOrder } = useTableOrder();

  const tableOrderForMe =
    tableOrder.orders.filter((x) => x.customer == auth?.user?.id) || [];

  const hasOrders = tableOrderForMe.length > 0;

  if (!hasOrders) {
    return null;
  }

  return (
    <>
      {tableOrderForMe.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                You made ({tableOrderForMe.length}) orders in this dining.
              </h3>
              <p className="text-sm text-gray-500">
                Track the status of your ongoing orders in real time
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {tableOrderForMe.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MyTableOrders;

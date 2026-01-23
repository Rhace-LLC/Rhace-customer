import { Bill, SplitRecord } from "@/api-services/billsettlement.service";
import { Order, OrderStatus } from "@/api-services/order.service";

export const formatCurrency = (value: string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(value));

export const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleString() : "—";

export const calculateOrderTotal = (order: Order): number => {
  return order.items.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    return total + price * item.quantity;
  }, 0);
};

export const getOrderStatusText = (status: OrderStatus) => {
  switch (status) {
    case "received":
      return "Your order has been received. We’ll start preparing it shortly.";
    case "paid":
      return "Your order is paid. We’ll begin preparation soon.";
    case "preparing":
      return "Your order is being prepared. Hang tight!";
    case "delivered":
      return "Your order has been delivered. How was your meal?";
    case "completed":
      return "Your order is completed. Thank you for dining with us!";
    case "cancelled":
      return "Your order was cancelled. Please contact support if you have any questions.";
    default:
      return "We’ll update you about your order status shortly.";
  }
};

export const getCustomerSplitRecord = (
  splits: SplitRecord[],
  customerId: string
): SplitRecord | undefined => {
  return splits.find((split) => split.customer === customerId);
};

export const getMyIndividualBillBreakdown = (
  customerId: string,
  bill: Bill | null
) => {
  if (!bill) {
    return null;
  }
  // 1️⃣ My orders
  const myOrders = bill.orders.filter((order) => order.customer === customerId);

  const myOrderIds = myOrders.map((o) => o.id);

  // 2️⃣ My bill total
  const myBillTotal = myOrders.reduce(
    (sum, order) => sum + Number(order.total_price),
    0
  );

  // 3️⃣ Who paid for ANY of my orders?
  const paymentThatPaidForMe =
    bill.individual_payments.find((payment) =>
      payment.paying_for_orders.some((orderId) => myOrderIds.includes(orderId))
    ) || null;

  // 4️⃣ Payment status
  const myBillPaymentStatus: "paid" | "pending" = paymentThatPaidForMe?.is_paid
    ? "paid"
    : "pending";

  // 5️⃣ Who paid?
  let paidBy: "me" | string | null = null;

  if (paymentThatPaidForMe) {
    paidBy =
      paymentThatPaidForMe.customer === customerId
        ? "me"
        : paymentThatPaidForMe.customer;
  }

  return {
    myBillTotal,
    myBillPaymentStatus,
    paidBy,
    paidByData: paymentThatPaidForMe,
  };
};

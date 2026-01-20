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

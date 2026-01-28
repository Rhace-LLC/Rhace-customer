import { Check, CheckCircle, DollarSign, Loader2, Plus } from "lucide-react";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useGroupOrder } from "@/hooks/useDineGroupOrder";
import { useGroupBill } from "../orders/hook/useGroupBill";
import {
  calculateOrderTotal,
  formatCurrency,
  getCustomerSplitRecord,
  getMyIndividualBillBreakdown,
  isNumberInArray,
} from "../utils/helpers";
import {
  initiateDiningGroupPayment,
  selectDiningGroupOrders,
  verifyDiningGroupPayment,
} from "@/api-services/billsettlement.service";
import { toast } from "sonner";
import { parseError } from "@/api-services/utils/parseError";
import { useLoading } from "@/contexts/LoadingContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

const BillSettlement = () => {
  const auth = useAuth();
  const { setLoading, setLoadingText } = useLoading();
  const [paymentDetails, setPaymentDetails] = useState<any>();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { groupBill, fetchGroupBill, groupBillError, groupBillLoading } =
    useGroupBill();
  const { groupOrder } = useGroupOrder();
  const isBillSplitting = groupBill?.payment_method == "split";

  const groupOrderForMe =
    groupBill?.orders?.filter((x) => x.customer == auth?.user?.id) || [];

  const groupOrderForOthers =
    groupBill?.orders?.filter((x) => x.customer !== auth?.user?.id) || [];

  const MY_SPLIT = getCustomerSplitRecord(
    groupBill?.split_records || [],
    auth?.user?.id || ""
  );

  const MY_TOTAL = groupOrderForMe.reduce((sum, order) => {
    return sum + calculateOrderTotal(order);
  }, 0);

  const MY_INDIVIDUAL_BILL = getMyIndividualBillBreakdown(
    auth?.user?.id || "",
    groupBill
  );

  const [addToBillLoading, setAddToBillLoading] = useState(false);
  //const [addToBillError, setAddToBillError] = useState<string | null>(null);

  const handleAddToMyBill = async (id: number) => {
    if (!groupOrder?.id || !auth.token) return;

    setAddToBillLoading(true);
    //setAddToBillError(null);

    try {
      await selectDiningGroupOrders(groupOrder.id, [id], auth.token);
      fetchGroupBill();
      toast.success("Added to my bill");
      // optional: refetch group order or optimistically update state
    } catch (error: any) {
      const message = parseError(error);
      toast.error(message);

      //setAddToBillError(message);
    } finally {
      setAddToBillLoading(false);
    }
  };

  const initiaiteOrderPayment = async (): Promise<any> => {
    try {
      setLoading(true);
      setLoadingText("Initializing Payment...");

      const response = await initiateDiningGroupPayment(
        groupOrder?.id || "",
        auth.token
      );
      setPaymentDetails(response);

      if (response?.authorization_url) {
        setIsPaymentDialogOpen(true);
      }

      toast.success("Payment initialized successfully!");

      return response;
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to initialize payment");
      console.error("❌ Error initializing payment:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify Payment
  const verifyPayment = async () => {
    try {
      setLoading(true);
      setLoadingText("Verifying Payment...");

      const response = await verifyDiningGroupPayment(
        groupOrder?.id || "",
        paymentDetails.reference,
        auth.token
      ); // from payments.service.ts
      fetchGroupBill();
      return response;
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to verify payment");
      console.error("❌ Error verifying payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentDialogClose = async () => {
    setIsPaymentDialogOpen(false);

    if (!paymentDetails?.reference) return;

    const result = await verifyPayment();
    fetchGroupBill();
    if (result?.data?.payment_status === "success") {
      toast.success("Payment completed successfully!");
    } else {
      toast.info("Payment not complete. Please try again.");
    }
  };

  useEffect(() => {
    if (!groupBill) {
      fetchGroupBill();
    }
  }, []);

  if (groupBillLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          <p className="text-sm text-gray-500">Loading bill summary…</p>
        </div>
      </div>
    );
  }

  if (groupBillError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-sm space-y-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Unable to load bill
          </h2>
          <p className="text-sm text-gray-500">
            Something went wrong while fetching the group bill.
          </p>
          <button
            onClick={fetchGroupBill}
            className="mt-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-12 px-4 py-8">
      {/* SECTION: INTRO */}
      <div className="mb-4 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tighter text-gray-900">
          Checkout
        </h1>
        <p className="text-[15px] leading-relaxed text-gray-400">
          Review your selection and choose how you’d like to settle the bill.
        </p>
      </div>

      {/* SECTION: THE BILL (YOUR ORDER) */}
      <div className="relative rounded-[0.5rem] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-900">
              <DollarSign size={18} strokeWidth={2} />
            </div>
            <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">
              Your Summary
            </h3>
          </div>
          <span className="rounded-full bg-blue-50 px-4 py-1.5 text-[13px] font-semibold text-blue-600">
            Personal - {MY_SPLIT?.is_paid ? "Paid" : "Unpaid"}
          </span>
        </div>

        <div className="space-y-4">
          {groupOrderForMe.map((order) =>
            order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-[14px]">
                <span className="text-gray-600">
                  {item.menu_item_name}
                  <span className="ml-2 text-[13px] font-medium text-gray-400">
                    × {item.quantity}
                  </span>
                  <span className="block text-[13px] font-medium text-blue-800">
                    Unit Price: {Number(item.price) / Number(item.quantity)}
                  </span>
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))
          )}
        </div>
        {groupBill?.payment_method === "split" ? (
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-[16px] font-semibold">
              <span>My Share of the Bill</span>
              <span className="tabular-nums">
                {formatCurrency(MY_SPLIT?.amount_to_pay || "0")}
              </span>
            </div>

            <p className="mt-1 text-[13px] text-gray-500">
              Your dining group selected{" "}
              <span className="font-medium">Split Bill</span>. This is your
              portion of the total bill.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex justify-between border-t pt-4 text-[16px] font-semibold">
            <span>My Order Total</span>
            <span className="tabular-nums">
              ₦{MY_TOTAL.toLocaleString("en-NG")}
            </span>
          </div>
        )}
      </div>
      <div className="w-full space-y-4">
        {/* ─────────────────────────────── */}
        {/* SPLIT BILL — PAID */}
        {/* ─────────────────────────────── */}
        {isBillSplitting && MY_SPLIT?.is_paid && (
          <>
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-[13px] font-bold tracking-[0.2em] text-emerald-600 uppercase">
                Payment Confirmed
              </p>
            </div>

            <div className="flex h-20 w-full items-center justify-between rounded-[2rem] border border-emerald-100 bg-emerald-50 px-8 text-emerald-700">
              <div>
                <p className="text-[12px] font-bold tracking-[0.15em] uppercase opacity-70">
                  Transaction
                </p>
                <p className="text-[16px] font-bold">Order Settled</p>
              </div>

              <p className="text-[18px] font-extrabold">
                {formatCurrency(MY_SPLIT.amount_to_pay)}
              </p>
            </div>
          </>
        )}

        {/* ─────────────────────────────── */}
        {/* SPLIT BILL — UNPAID */}
        {/* ─────────────────────────────── */}
        {isBillSplitting && !MY_SPLIT?.is_paid && (
          <>
            <button
              onClick={initiaiteOrderPayment}
              className="flex h-16 w-full items-center justify-center rounded-[1.5rem] bg-black text-[15px] font-semibold tracking-tight text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-95"
            >
              Proceed to Payment •{" "}
              {formatCurrency(MY_SPLIT?.amount_to_pay || "0")}
            </button>
          </>
        )}

        {groupBill &&
          MY_INDIVIDUAL_BILL &&
          groupBill.payment_method === "individual" && (
            <div className="w-full space-y-4">
              {/* ─────────────────────────────── */}
              {/* PAYMENT PENDING — SHOW PAY CTA */}
              {/* ─────────────────────────────── */}
              {MY_INDIVIDUAL_BILL.myBillPaymentStatus === "pending" && (
                <button
                  onClick={initiaiteOrderPayment}
                  className="flex h-16 w-full items-center justify-center rounded-[1.5rem] bg-black text-[15px] font-semibold tracking-tight text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-95"
                >
                  Proceed to Payment •{" "}
                  <>
                    ₦ {MY_INDIVIDUAL_BILL.myBillTotal.toLocaleString("en-NG")}
                  </>
                </button>
              )}

              {MY_INDIVIDUAL_BILL.myBillPaymentStatus === "paid" &&
                MY_INDIVIDUAL_BILL.paidBy === "me" && (
                  <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 px-8 py-6 text-emerald-700">
                    <p className="text-[13px] font-bold tracking-[0.15em] uppercase">
                      Payment Complete
                    </p>

                    <p className="mt-1 text-[16px] font-semibold">
                      You’ve paid for your bill
                    </p>

                    {MY_INDIVIDUAL_BILL.paidByData?.paying_for_orders.length! >
                      1 && (
                      <p className="mt-2 text-[13px] opacity-80">
                        You also covered other diners’ orders. Thank you 🙏
                      </p>
                    )}
                  </div>
                )}

              {/* ─────────────────────────────── */}
              {/* PAID BY SOMEONE ELSE */}
              {/* ─────────────────────────────── */}
              {MY_INDIVIDUAL_BILL.myBillPaymentStatus === "paid" &&
                MY_INDIVIDUAL_BILL.paidBy !== "me" &&
                MY_INDIVIDUAL_BILL.paidByData && (
                  <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 px-8 py-6 text-emerald-700">
                    <p className="text-[13px] font-bold tracking-[0.15em] uppercase">
                      Payment Complete
                    </p>

                    <p className="mt-1 text-[16px] font-semibold">
                      Your bill was paid for you
                    </p>

                    <p className="mt-2 text-[13px] opacity-80">
                      Paid by{" "}
                      <span className="font-medium">
                        {MY_INDIVIDUAL_BILL.paidByData.customer_name}
                      </span>
                    </p>
                  </div>
                )}
            </div>
          )}
      </div>

      <div className="hidden space-y-4 rounded-[2.5rem] bg-gray-50 p-8">
        {isBillSplitting && !!MY_SPLIT?.is_paid && (
          <>
            <p>Paid</p>
          </>
        )}
        <button
          onClick={initiaiteOrderPayment}
          disabled={isBillSplitting && !!MY_SPLIT?.is_paid}
          className="flex h-16 w-full items-center justify-center rounded-[1.5rem] bg-black text-[15px] font-semibold tracking-tight text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-95"
        >
          Proceed to Payment •{" "}
          {isBillSplitting ? (
            formatCurrency(MY_SPLIT?.amount_to_pay || "0")
          ) : (
            <>₦ {MY_TOTAL.toLocaleString("en-NG")}</>
          )}
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-[13px] leading-tight text-gray-400 sm:text-left">
            You will be billed for your order and any other person you choose to
            cover.
          </p>
          {!isBillSplitting && (
            <button className="text-[14px] font-semibold text-gray-900 underline underline-offset-8 transition-opacity hover:opacity-60">
              Cover everyone’s bill
            </button>
          )}
        </div>
      </div>

      <p className="mb-3 rounded-full px-4 py-1.5 text-[16px] font-semibold text-gray-600">
        Summary for others in the group.
      </p>
      {/* SECTION: OTHER DINERS */}
      <div className="space-y-4">
        {groupOrderForOthers.map((order) => {
          const orders = order.items;
          const total = calculateOrderTotal(order);
          const customerId = order.customer;
          const customerName = order.customer_name_display;

          const customerSplit = getCustomerSplitRecord(
            groupBill?.split_records || [],
            customerId
          );

          const isAdded = isNumberInArray(
            MY_INDIVIDUAL_BILL?.myBill[0]?.paying_for_orders || [],
            order.id
          );
          let showAdd = !isBillSplitting && !order.is_paid;

          return (
            <div
              key={customerId}
              className={cn(
                "flex items-center justify-between rounded-[2rem] border p-5 transition-all",
                isAdded
                  ? "border-black bg-black text-white shadow-xl"
                  : "border-gray-100 bg-white"
              )}
            >
              <div>
                <p className="text-[14px] font-semibold">{customerName}</p>
                <p
                  className={cn(
                    "text-[13px]",
                    isAdded ? "text-white/60" : "text-gray-400"
                  )}
                >
                  {orders.length} order(s)
                </p>
              </div>

              <div className="text-right">
                {isBillSplitting ? (
                  <>
                    <p className="font-semibold tabular-nums">
                      {formatCurrency(customerSplit?.amount_to_pay || "0")}
                    </p>
                  </>
                ) : (
                  <p className="font-semibold tabular-nums">
                    {formatCurrency(String(total))}
                  </p>
                )}
                {showAdd ? (
                  <button
                    disabled={addToBillLoading || isAdded}
                    onClick={() => {
                      if (addToBillLoading || isAdded) return;
                      handleAddToMyBill(order.id);
                    }}
                    className={cn(
                      "group mt-2 flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold tracking-tight transition-all active:scale-95",
                      addToBillLoading && "cursor-not-allowed opacity-70",
                      isAdded
                        ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                        : "bg-blue-50 text-blue-600 ring-1 ring-blue-100 hover:bg-blue-600 hover:text-white hover:ring-blue-600"
                    )}
                  >
                    {addToBillLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Adding</span>
                      </>
                    ) : isAdded ? (
                      <>
                        <Check size={12} strokeWidth={3} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus
                          size={12}
                          strokeWidth={3}
                          className="transition-transform group-hover:rotate-90"
                        />
                        <span>Add to bill</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="mt-2 flex items-center gap-1.5 px-1 text-[11px] font-extrabold tracking-widest text-gray-300 uppercase">
                    <div className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>Settled</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="py-5" />

      <Dialog
        open={isPaymentDialogOpen}
        onOpenChange={(open) => {
          if (!open) handlePaymentDialogClose(); // Only allow closing via your handler
        }}
      >
        <DialogContent
          className="h-[500px] w-[80%] max-w-lg overflow-y-auto rounded-2xl p-0"
          onInteractOutside={(e) => e.preventDefault()} // Prevents closing on outside click
        >
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
            <div className="space-y-2 py-2 text-center">
              <DialogTitle>
                Complete Payment{" "}
                <CheckCircle className="inline h-4 w-5 text-green-500" />
              </DialogTitle>
              <DialogDescription>
                Follow the steps below to complete your payment.
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Payment iframe */}
          <iframe
            src={paymentDetails?.authorization_url}
            title="Payment"
            className="h-[600px] w-full overflow-y-auto border-0"
          ></iframe>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillSettlement;

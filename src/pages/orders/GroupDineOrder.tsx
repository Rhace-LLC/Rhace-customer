import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { ShareDineDialog } from "./components/shareDialog";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LogOut, Share2, Users } from "lucide-react";

import {
  addItemsToOrder,
  createOrder,
  CreateOrderPayload,
  OrderItem,
} from "@/api-services/order.service";

import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { toast } from "sonner";
import { parseError } from "@/api-services/utils/parseError";
import { formatNumberWithDecimals } from "@/utils/utils";

import { clearCart } from "@/store/orderCart.slice";
import { useGroupOrder } from "@/hooks/useDineGroupOrder";
import FullScreenError, {
  FullScreenLoader,
  NoCartItem,
  UnpaidOrderCard,
  UserCart,
} from "./components/utils";
import { GetBillConfirmation } from "./components/BillSettlementModal";
import {
  requestDiningGroupBill,
  submitSplitAmounts,
} from "@/api-services/billsettlement.service";
import { useGroupBill } from "./hook/useGroupBill";
import {
  BillSplitterModal,
  BillSubmission,
} from "./components/AllocationModal";

import { useSetupContext } from "@/contexts/SetupContext";

import {
  calculateOrderTotal,
  formatCurrency,
  getCustomerSplitRecord,
  getMyIndividualBillBreakdown,
} from "../utils/helpers";
import { LeaveGroupConfirmation } from "./components/leavegroupconfirm";

const GroupDineOrder = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const orderCart = useSelector((state: RootState) => state.orderCart);

  const setup = useSetupContext();
  const selectedRestaurant = setup.selectedRestaurant;

  const { groupOrder, fetchGroupOrder, loading, error, groupOrderRefresh } =
    useGroupOrder();
  const {
    groupBill,
    fetchGroupBill,
    groupBillError,
    groupBillLoading,
    groupBillRefresh,
  } = useGroupBill();

  const { setLoading, setLoadingText } = useLoading();
  const navigate = useNavigate();
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const groupOrderForMe =
    groupOrder?.orders?.filter((x) => x.customer == auth?.user?.id) || [];

  const groupOrderForOthers =
    groupOrder?.orders?.filter((x) => x.customer !== auth?.user?.id) || [];

  const groupedOrdersForOthers = groupOrderForOthers.reduce<
    Record<
      string,
      {
        customerName: string;
        orders: typeof groupOrderForOthers;
      }
    >
  >((acc, order) => {
    if (!acc[order.customer]) {
      acc[order.customer] = {
        customerName: order.customer_name_display,
        orders: [],
      };
    }

    acc[order.customer].orders.push(order);
    return acc;
  }, {});

  const notYetProcessedBillSplit =
    groupBill?.payment_method === "split" &&
    groupBill?.split_records?.length == 0;

  const hasCartItems = orderCart.data.length > 0;
  const hasActiveOrders = groupOrderForMe.length > 0;

  const iAmAdmin = auth?.user?.id === groupOrder?.created_by;
  const billGenerated = !!groupBill;
  const isBillPending =
    groupBillError === "Field error: No bill found for this dining group";

  const isBillSplitting = groupBill?.payment_method == "split";

  const MY_SPLIT = getCustomerSplitRecord(
    groupBill?.split_records || [],
    auth?.user?.id || ""
  );

  const MY_INDIVIDUAL_BILL = getMyIndividualBillBreakdown(
    auth?.user?.id || "",
    groupBill
  );

  const myBillPaid =
    MY_SPLIT?.is_paid || MY_INDIVIDUAL_BILL?.myBillPaymentStatus === "paid";

  const MY_TOTAL = groupOrderForMe.reduce((sum, order) => {
    return sum + calculateOrderTotal(order);
  }, 0);

  const refresh = () => {
    groupOrderRefresh();
    groupBillRefresh();
  };

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      setLoadingText("Submitting Order");

      const payload: CreateOrderPayload = {
        customer_id: auth?.user?.id || "", // adjust as needed
        order_type: "dine-in", // or "takeaway", etc.
        table_id: selectedRestaurant?.tableId,
        items: orderCart.data.map((cartItem) => {
          return {
            menu_item_id: cartItem.dishData.id,
            quantity: cartItem.quantity,
          } as OrderItem;
        }),
        status: "received",
        customer_name: `${auth?.user?.last_name} ${auth?.user?.first_name}`,
        customer_phone: "",
        address: "", // optional
      };

      await createOrder(payload, auth.token);
      toast.info(
        "Order Submitted Successfully, You may now proceed to settle bill"
      );
      groupOrderRefresh();
      dispatch(clearCart());
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    const addOrderPayload = orderCart.data.map((x) => {
      return { menu_item_id: x.dishData.id, quantity: x.quantity };
    });

    try {
      setLoading(true);
      setLoadingText("Updating Order");
      if (!groupOrderForMe[0]) {
        toast.error("No pending order found to update.");
        return;
      }

      await addItemsToOrder(
        groupOrderForMe[0]?.id,
        { items: addOrderPayload },
        auth.token
      );
      groupOrderRefresh();
      dispatch(clearCart());
    } catch (error) {
      const errorMessage = parseError(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const [openGetBillModal, setOpenGetBillModal] = useState(false);

  const handleProceedGetBill = async (option: "individual" | "split") => {
    if (!groupOrder?.id || !auth.token) return;

    try {
      setLoading(true);
      setLoadingText("Getting bill...");

      await requestDiningGroupBill(groupOrder.id, option, auth.token);

      // optional: close modal here if needed
      if (option == "split") {
        setShowAllocationModal(true);
      } else {
        refresh();
      }
    } catch (error: any) {
      const errorMessage = parseError(error);
      // optional: show toast / notification console.log({})
      toast.error(errorMessage || "Unable to get bill. Please try again.");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const handleSubmitBillSplit = async (data: BillSubmission) => {
    try {
      setLoading(true);
      setLoadingText("Allocating user bills...");

      await submitSplitAmounts(groupOrder?.id || "", data, auth.token);
      refresh();
      setShowAllocationModal(false);
    } catch (error: any) {
      const errorMessage = parseError(error);
      toast.error(
        errorMessage || "Unable to allocate bills bill. Please try again."
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const cartItems = orderCart.data || [];

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.dishData.price || "0");
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (!groupBill) {
      fetchGroupBill();
    }
    if (!groupOrder) {
      fetchGroupOrder();
    }
  }, [groupBill, groupOrder]);

  useEffect(() => {
    const interval = setInterval(() => {
      groupBillRefresh();
    }, 20_000);

    return () => clearInterval(interval);
  }, [fetchGroupBill]);

  useEffect(() => {
    if (myBillPaid) {
      dispatch(clearCart());
    }
  }, [myBillPaid]);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <FullScreenError message={error} onRetry={fetchGroupOrder} />;
  }
  // Header
  // No Content UI
  // Loading Group Order
  // Load Error UI
  // Render Cart
  // Submit Order
  // Render Order
  // Update Order
  // Render Get Bill (If you are the one that created the group)
  // Render Settle Bill UI
  // Integrate payment to this.

  return (
    <>
      {true && (
        <>
          {/* 3. Wire the Confirmation Component */}
          <LeaveGroupConfirmation
            open={isLeaveDialogOpen}
            onOpenChange={setIsLeaveDialogOpen}
            hasActiveOrders={true} // You can pass dynamic data here
          />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-foreground text-2xl font-bold tracking-tight">
                Group Dining
              </h1>
              <p className="text-foreground/60 text-sm">
                Dining together with others.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Leave Group Button - Muted/Danger style */}
              <button
                onClick={() => setIsLeaveDialogOpen(true)} // Open the dialog
                className="flex h-12 cursor-pointer items-center justify-center rounded-xl border border-rose-100 bg-rose-50/50 px-4 text-rose-600 transition-all hover:bg-rose-100 active:scale-95"
                title="Leave Group"
              >
                <LogOut size={20} />
                <span className="text-[10px] tracking-widest uppercase sm:hidden">
                  Leave Group
                </span>
              </button>

              {/* Share Invite Button - Primary style */}
              <button
                onClick={() => setShareDialogOpen(true)}
                className="bg-primary/10 text-primary-600 hover:bg-primary/20 flex h-12 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-bold transition-all active:scale-95"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline"></span>
              </button>
            </div>
          </div>

          {/* Render user Order */}
          {groupOrderForMe.length > 0 && (
            <>
              {/* Here we show you your order and prompt you to pay, you would also see your cart and if there is any stuff in your cart, you can update the order */}
              <UnpaidOrderCard data={groupOrderForMe} />
            </>
          )}

          {groupOrderForMe.length == 0 && (
            <>
              <UserCart />
              {/* there isnt any unpaid orders and no uncoompleted order, so show the cart and the functionality would be to to submit order*/}
            </>
          )}
        </>
      )}

      {orderCart.data.length == 0 && groupOrderForMe.length == 0 && (
        <NoCartItem />
      )}

      {/* Submit Order*/}

      {hasCartItems && !hasActiveOrders && (
        <div className="animate-in fade-in slide-in-from-bottom-4 mt-6 duration-500">
          {/* Divider */}
          <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* SUBMIT CART ORDER */}

              <>
                <div className="space-y-1 text-center">
                  <p className="text-[16px] font-medium tracking-[0.2em] text-gray-400 uppercase">
                    Your Cart Order Totals To:
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-bold text-gray-900">₦</span>
                    <span className="text-3xl font-medium tracking-tighter text-gray-900">
                      {formatNumberWithDecimals(totalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black px-8 text-[16px] font-semibold tracking-[0.2em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-gray-900 active:scale-95"
                >
                  Submit Order
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </>
            </div>
          </div>
        </div>
      )}

      {/* Update Function*/}
      {hasCartItems && hasActiveOrders && (
        <>
          <div className="animate-in fade-in slide-in-from-bottom-4 mt-6 duration-500">
            {/* Divider */}
            <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* SUBMIT CART ORDER */}
                <button
                  onClick={handleUpdateOrder}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black px-8 text-[16px] font-semibold tracking-[0.2em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-gray-900 active:scale-95"
                >
                  Update Order
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
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

        {groupBill &&
          MY_INDIVIDUAL_BILL &&
          groupBill.payment_method === "individual" && (
            <div className="w-full space-y-4">
              {/* ─────────────────────────────── */}
              {/* PAYMENT PENDING — SHOW PAY CTA */}
              {/* ─────────────────────────────── */}

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
                      <>
                        <p className="mt-2 text-[13px] opacity-80">
                          You also covered other diners’ orders. Thank you 🙏
                        </p>
                        <p className="mt-2 text-[13px] opacity-80">
                          Total Paid: {MY_INDIVIDUAL_BILL.myBillTotal}
                        </p>
                      </>
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

                    <p className="mt-1 text-[16px] font-semibold">
                      Total : {MY_TOTAL}
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
      {/* Updated Function Area*/}
      {hasActiveOrders && !hasCartItems && (
        <div className="animate-in fade-in slide-in-from-bottom-4 mt-6 duration-500">
          {/* Divider */}
          <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* --------- Loading / Error State --------- */}
              {groupBillLoading && (
                <div className="flex w-full items-center justify-center gap-3 py-4">
                  <span className="text-gray-500">Loading bill...</span>
                </div>
              )}

              {groupBillError && (
                <>
                  {!isBillPending ? (
                    <>
                      {/* Normal Error */}
                      <div className="flex w-full flex-col items-center justify-center gap-3 py-4">
                        <p className="text-center text-[14px] font-medium text-red-500">
                          Unable to load group bill.
                        </p>

                        <button
                          onClick={fetchGroupBill}
                          className="w-full rounded-2xl bg-black px-6 py-3 text-[13px] font-semibold text-white uppercase shadow transition-all hover:bg-gray-900 active:scale-95"
                        >
                          Retry
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {iAmAdmin ? (
                        <>
                          <button
                            onClick={() => {
                              if (
                                billGenerated &&
                                groupBill.payment_method === "split" &&
                                notYetProcessedBillSplit
                              ) {
                                setShowAllocationModal(true);
                                return;
                              }
                              setOpenGetBillModal(true);
                            }}
                            className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 px-8 text-[14px] font-semibold tracking-[0.25em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-black active:scale-95 sm:w-auto"
                          >
                            Get Bill
                            <ArrowRight
                              size={16}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex w-full flex-col items-center justify-center gap-3 py-4">
                            <p className="text-center text-[14px] font-medium text-gray-500">
                              The group bill hasn’t been generated yet.
                            </p>

                            <button
                              onClick={fetchGroupBill}
                              className="w-full cursor-pointer rounded-2xl bg-gray-900 px-6 py-3 text-[13px] font-semibold text-white uppercase shadow transition-all hover:bg-black active:scale-95"
                            >
                              Check again
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {!groupBillLoading && !groupBillError && (
                <>
                  {iAmAdmin ? (
                    <>
                      {!billGenerated || notYetProcessedBillSplit ? (
                        // Admin sees Get Bill button if bill hasn't been generated
                        <button
                          onClick={() => {
                            if (
                              billGenerated &&
                              groupBill?.payment_method == "split" &&
                              notYetProcessedBillSplit
                            ) {
                              setShowAllocationModal(true);
                              return;
                            }
                            setOpenGetBillModal(true);
                          }}
                          className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 px-8 text-[14px] font-semibold tracking-[0.25em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-black active:scale-95 sm:w-auto"
                        >
                          Get Bill
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </button>
                      ) : (
                        // Admin sees Settle Bill only after bill generated
                        <Link
                          to="/bill-settlement"
                          className="w-full sm:w-auto"
                        >
                          <button className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 px-8 text-[14px] font-semibold tracking-[0.25em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-black active:scale-95 sm:w-auto">
                            {MY_SPLIT?.is_paid || MY_INDIVIDUAL_BILL?.paidBy
                              ? "View"
                              : "Settle"}{" "}
                            Bill
                            <ArrowRight
                              size={16}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </button>
                        </Link>
                      )}
                    </>
                  ) : (
                    // Non-admin users always see Settle Bill
                    <button
                      onClick={() => navigate("/bill-settlement")}
                      className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 px-8 text-[14px] font-semibold tracking-[0.25em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-black active:scale-95 sm:w-auto"
                    >
                      {MY_SPLIT?.is_paid || MY_INDIVIDUAL_BILL?.paidBy
                        ? "View"
                        : "Settle"}{" "}
                      Bill
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- GROUP ORDER OVERVIEW --- */}
      <div className="mt-8 mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-100" />
        <p className="text-[16px] font-medium tracking-tight text-gray-400">
          See what your table group are ordering
        </p>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <div className="space-y-4">
        {Object.entries(groupedOrdersForOthers).map(([customerId, group]) => {
          const allItems = group.orders.flatMap((o) => o.items);

          const totalAmount = group.orders.reduce(
            (sum, o) => sum + Number(o.total_price),
            0
          );

          return (
            <div
              key={customerId}
              className="rounded-2xl border border-gray-100 bg-white p-5 transition-colors hover:border-gray-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[16px] font-semibold tracking-tight text-gray-900 ring-1 ring-gray-100 ring-inset">
                    {group.customerName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-semibold tracking-tight text-gray-900">
                      {group.customerName}
                    </p>
                    <p className="text-[16px] text-gray-400">
                      {allItems.length} item(s) ordered
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[16px] font-medium tracking-widest text-gray-300 uppercase">
                    Total
                  </p>
                  <p className="font-semibold tracking-tighter text-gray-900">
                    ₦{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-gray-50" />

              {/* Order Items */}
              <div className="space-y-3 px-1">
                {allItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-baseline justify-between"
                  >
                    <span className="tracking-tight text-gray-600">
                      {item.menu_item_name}
                    </span>
                    <span className="text-[16px] font-medium tracking-tighter text-gray-400 tabular-nums">
                      ₦{Number(item.price).toLocaleString()} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {groupOrderForOthers.length === 0 && (
          <div className="group animate-in fade-in zoom-in-95 flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-6 px-6 py-16 text-center shadow-sm transition-all duration-700 hover:shadow-md">
            {/* Minimalist Graphic Element */}
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gray-50/50 ring-1 ring-gray-100/50 ring-inset">
              <div className="absolute h-12 w-12 animate-pulse rounded-full bg-blue-50/50" />
              <Users
                size={32}
                strokeWidth={1.5}
                className="relative text-gray-300"
              />
            </div>

            {/* Typography */}
            <div className="max-w-[240px] space-y-2">
              <h4 className="text-[16px] font-semibold tracking-[0em] text-gray-600 uppercase">
                Group Activity
              </h4>
              <p className="text-md font-semibold tracking-tight text-gray-900">
                No other orders yet
              </p>
              <p className="text-[12px] leading-relaxed text-gray-400/80">
                When your friends adds to their orders, they’ll appear here in
                real-time.
              </p>
            </div>

            {/* Subtle Decorative Line */}
            <div className="mt-10 h-px w-12 bg-gray-100" />
          </div>
        )}
      </div>

      <ShareDineDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
      <GetBillConfirmation
        open={openGetBillModal}
        onOpenChange={setOpenGetBillModal}
        onProceed={handleProceedGetBill}
      />

      <BillSplitterModal
        open={showAllocationModal}
        onOpenChange={setShowAllocationModal}
        onSubmit={(data) => {
          handleSubmitBillSplit(data);
        }}
      />
    </>
  );
};

export default GroupDineOrder;

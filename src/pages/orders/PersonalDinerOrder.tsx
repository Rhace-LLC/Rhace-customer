import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import OrderSummary from "./cartsummary";
import UserOrder from "./userorder";
const PersonalDineOrder = () => {
  const navigate = useNavigate();

  const orderCart = useSelector((state: RootState) => state.orderCart);

  return (
    <>
      {orderCart.data.length > 0 && (
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Personal Dining
          </h1>

          <p className="text-foreground/60 text-sm">
            A private dining experience, just for you.
          </p>
        </div>
      )}

      <UserOrder />
      {orderCart.data.length > 0 && (
        <OrderSummary
          OnCreateOrder={() => {
            // order progress -
            // save current paid order. in the my order page.
            // switch to active order view. great.
            navigate("");
          }}
        />
      )}
    </>
  );
};

export default PersonalDineOrder;

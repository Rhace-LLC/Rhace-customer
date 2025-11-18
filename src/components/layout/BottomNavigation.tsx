import { Home, ShoppingBag, Utensils, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const orderCart = useSelector((state: RootState) => state.orderCart);
  const totalCartItems = orderCart?.data?.length || 0;

  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "menu", label: "Menu", icon: Utensils, path: "/menu" },
    { id: "orders", label: "Orders", icon: ShoppingBag, path: "/orders" },
    {
      id: "reservation",
      label: "Reservations",
      icon: CalendarDays,
      path: "/reservations",
    },
  ];

  return (
    <div className="border-border fixed right-0 bottom-0 left-0 z-50 border-t bg-white shadow-sm">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, label, icon: Icon, path }) => (
          <Link
            key={id}
            to={path}
            onClick={() => onTabChange(id)}
            className={`relative flex min-w-0 flex-1 flex-col items-center p-2 transition-colors ${
              activeTab === id
                ? "text-primary"
                : "text-muted-foreground hover:text-primary/70"
            }`}
          >
            <div className="relative">
              <Icon className="mb-1 h-5 w-5" />
              {id === "orders" && totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-[5px] text-[10px] font-semibold text-white shadow-md">
                  {totalCartItems}
                </span>
              )}
            </div>
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

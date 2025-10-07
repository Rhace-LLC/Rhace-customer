import { Home, Menu, ShoppingBag, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "menu", label: "Menu", icon: Menu, path: "/menu" },
    { id: "orders", label: "Orders", icon: ShoppingBag, path: "/orders" },
    { id: "payments", label: "Payments", icon: CreditCard, path: "/payments" },
  ];

  return (
    <div className="border-border fixed right-0 bottom-0 left-0 z-50 border-t bg-white">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, label, icon: Icon, path }) => (
          <Link
            key={id}
            to={path}
            onClick={() => onTabChange(id)}
            className={`flex min-w-0 flex-1 flex-col items-center p-2 transition-colors ${
              activeTab === id
                ? "text-primary"
                : "text-muted-foreground hover:text-primary/70"
            }`}
          >
            <Icon className="mb-1 h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

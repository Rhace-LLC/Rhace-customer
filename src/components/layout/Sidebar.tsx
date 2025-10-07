import {
  Home,
  Menu,
  CalendarDays,
  ShoppingBag,
  CreditCard,
  Bell,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "menu", label: "Menu", icon: Menu, path: "/menu" },
    {
      id: "reservations",
      label: "Reservations",
      icon: CalendarDays,
      path: "/reservations",
    },
    { id: "orders", label: "Orders", icon: ShoppingBag, path: "/orders" },
    { id: "payments", label: "Payments", icon: CreditCard, path: "/payments" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const handleItemClick = (id: string) => {
    onTabChange(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 transform bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                <span className="font-medium text-white">B</span>
              </div>
              <span className="text-xl font-medium">Bookies</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                onClick={() => handleItemClick(id)}
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                  activeTab === id
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

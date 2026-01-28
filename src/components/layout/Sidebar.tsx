import {
  Home,
  CalendarDays,
  ShoppingBag,
  CreditCard,
  Bell,
  User,
  X,
  Utensils,
  AlertCircle,
  PowerOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import RhaceLogo from "../../assets/Rhace-Favicon.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLogout } from "./useLogout";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { logout } = useLogout();
  const auth = useAuth();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false); // close dialog
    logout(); // call logout
    onClose(); // close sidebar
  };
  const menuItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "menu", label: "Menu", icon: Utensils, path: "/menu" },
    { id: "orders", label: "My Order", icon: ShoppingBag, path: "/orders" },
    {
      id: "reservations",
      label: "Reservations",
      icon: CalendarDays,
      path: "/reservations",
    },
    { id: "payments", label: "Payments", icon: CreditCard, path: "/payments" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
    /*    
    {
      id: "bills-settlement",
      label: "Bill Summary",
      icon: Receipt,
      path: "/bill-settlement",
    },    
    */
    {
      id: "order-history",
      label: "Past Orders",
      icon: ShoppingBag,
      path: "/order-history",
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
        className={`fixed top-0 left-0 z-50 h-full w-80 transform overflow-auto bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center justify-center gap-2 space-y-3 pt-2">
              <div className="border-foreground-100 w-max overflow-hidden rounded-full border p-2 shadow-sm">
                <img
                  src={RhaceLogo}
                  alt="Rhace Logo"
                  className="h-full w-[15px] object-contain"
                />
              </div>
              <span className="text-foreground-900 relative bottom-2 text-[20px] font-bold tracking-tighter">
                Rhace
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="mb-10 space-y-2">
            {menuItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                onClick={() => handleItemClick(id)}
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                  activeTab === id
                    ? "bg-primary text-white"
                    : "hover:bg-foreground-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          {auth.isAuthenticated ? (
            <div className="mt-6 mb-20">
              <Dialog
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer border-0 bg-red-50 text-red-500"
                    onClick={() => setLogoutDialogOpen(true)}
                  >
                    Log Out <PowerOff className="inline h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%]">
                  <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to log out? You will be redirected
                      to the login page.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setLogoutDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-600 text-white"
                      onClick={handleLogoutConfirm}
                    >
                      Log Out
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="mx-auto mt-10 mb-[80px] flex max-w-md flex-col items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <h2 className="text-md font-semibold text-yellow-800">
                You are not logged in
              </h2>
              <p className="text-sm text-yellow-700">
                Login to access the full features of the app. Click the button
                below to proceed.
              </p>
              <Button
                onClick={() => {
                  navigate("/login");
                  onClose();
                }}
                className="mt-2 w-full"
              >
                Proceed to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { DiningPreferencePrompt } from "@/contexts/DiningPromptContext";
import { DiningGroupView } from "@/contexts/GroupDiningView";
import { SetupProvider } from "@/contexts/SetupContext";

import NotFound from "@/pages/404";
import ForgotPassword from "@/pages/auth/forgotpassword";
import Login from "@/pages/auth/login";
import ResetPassword from "@/pages/auth/resetpassword";
import Signup from "@/pages/auth/signup";
import OtpVerification from "@/pages/auth/verifyaccount";
import BillSettlement from "@/pages/billsettlement";

import { HomePage } from "@/pages/home";
import { MenuPage } from "@/pages/menu";
import { NotificationsPage } from "@/pages/notifications";
import { OrdersPage } from "@/pages/orders";
import ActiveOrderPage from "@/pages/orders/ActiveOrderPage";
import { FullScreenLoader } from "@/pages/orders/components/utils";
import { useUnpaidUncompleted } from "@/pages/orders/hook/useUnpaidUncompleted";
import { PastOrders } from "@/pages/past_orders";
import { PaymentsPage } from "@/pages/payments";
import { Profile } from "@/pages/profile";
import { ReservationsPage } from "@/pages/reservations";
import { AllRestaurantsView } from "@/pages/reservations/AllRestaurantView";
import { RestaurantDetailView } from "@/pages/reservations/RestaurantDetailView";
import React, { useEffect, useState, useRef } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { toast } from "sonner";

// --------------------- Scroll to top on route change ---------------------
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const toastShown = useRef(false); // track if toast was already shown

  useEffect(() => {
    if (!auth.isAuthenticated && !toastShown.current) {
      toastShown.current = true;
      toast.error("You must be logged in to access this page!");
    }
  }, [auth.isAuthenticated]);

  if (auth.loading) {
    return <FullScreenLoader />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// --------------------- Main Router ---------------------
function Navigation(): React.JSX.Element {
  return (
    <Router>
      <ScrollToTop />
      <SetupProvider>
        <DiningPreferencePrompt />
        <DiningGroupView />
        <NavigationContent />
      </SetupProvider>
    </Router>
  );
}

function NavigationContent() {
  const {
    unpaidOrders,
    uncompletedOrders,
    getUserUnpaidOrder,
    getUserActiveOrder,
  } = useUnpaidUncompleted();

  useEffect(() => {
    if (uncompletedOrders.length == 0 && unpaidOrders.length == 0) {
      getUserActiveOrder();
      getUserUnpaidOrder();
    }
  }, []);

  const auth = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("home");
  const [title, setTitle] = useState("");
  const location = useLocation();

  // Map pathname to tab key and title
  const pathToTab: Record<string, { tab: string; title: string }> = {
    "/": { tab: "home", title: "Home" },
    "/menu": { tab: "menu", title: "Menu" },
    "/orders": { tab: "order", title: "My Order" },
    "/order-history": { tab: "past-orders", title: "My Past Orders" },
    "/reservations": { tab: "reservations", title: "Reservations" },
    "/payments": { tab: "payments", title: "Payments" },
    "/bill-settlement": { tab: "bills", title: "Bill Summary" },
    "/notifications": { tab: "notifications", title: "Notifications" },
    "/profile": { tab: "profile", title: "Profile" },
    "/login": { tab: "login", title: "Login" },
    "/orders/active": { tab: "active-orders", title: "Active Orders" },
  };

  // Update activeTab and title whenever location changes
  useEffect(() => {
    const mapping = pathToTab[location.pathname];
    if (mapping) {
      setActiveTab(mapping.tab);
      setTitle(mapping.title);
    } else {
      setActiveTab("home");
      setTitle("Rhace");
    }
  }, [location.pathname]);

  // Redirect logged-in users away from /login
  useEffect(() => {
    if (auth.isAuthenticated && location.pathname === "/login") {
      navigate("/");
    }
  }, [auth.isAuthenticated, location.pathname]);

  const hideHeaderAndNav = [
    "/login",
    "/signup",
    "/forgot-password",
    "/resetpassword",
    "/verify-email",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen">
      {!hideHeaderAndNav && (
        <>
          <Header title={title} onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="py-8" />
        </>
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={() => {}}
      />

      <main className="flex">
        <section id="mainpage" className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" Component={Login} />
            <Route path="/signup" Component={Signup} />
            <Route path="/forgot-password" Component={ForgotPassword} />
            <Route path="/resetpassword" Component={ResetPassword} />
            <Route path="/verify-email" Component={OtpVerification} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            {/* Protected Routes */}
            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <MenuPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/active"
              element={
                <ProtectedRoute>
                  <ActiveOrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-history"
              element={
                <ProtectedRoute>
                  <PastOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bill-settlement"
              element={
                <ProtectedRoute>
                  <BillSettlement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <ReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-restaurants"
              element={
                <ProtectedRoute>
                  <AllRestaurantsView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-restaurant/:id"
              element={<RestaurantDetailView />}
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" Component={NotFound} />
          </Routes>
        </section>
      </main>

      {!hideHeaderAndNav && (
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}

export default Navigation;

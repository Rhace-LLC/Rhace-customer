import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/404";
import ForgotPassword from "@/pages/auth/forgotpassword";
import Login from "@/pages/auth/login";
import ResetPassword from "@/pages/auth/resetpassword";
import Signup from "@/pages/auth/signup";
import OtpVerification from "@/pages/auth/verifyaccount";
import { HomePage } from "@/pages/home";
import { MenuPage } from "@/pages/menu";
import { NotificationsPage } from "@/pages/notifications";
import { OrdersPage } from "@/pages/orders";
import { PaymentsPage } from "@/pages/payments";
import { ProfilePage } from "@/pages/profile";
import { ReservationsPage } from "@/pages/reservations";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

// --------------------- Scroll to top on route change ---------------------
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

/** 🔒 Protected Route Wrapper */
function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  console.log("isAuth", auth.isAuthenticated)

  if (auth.loading) {
    return <div className="p-8 text-center">Loading Session...</div>;
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
      <NavigationContent />
    </Router>
  );
}

function NavigationContent() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  console.log(auth)

  const getPageTitle = () => {
    switch (activeTab) {
      case "home":
        return "Home";
      case "menu":
        return "Menu";
      case "orders":
        return "Orders";
      case "reservations":
        return "Reservations";
      case "payments":
        return "Payments";
      case "notifications":
        return "Notifications";
      case "profile":
        return "Profile";
      default:
        return "Bookies";
    }
  };
  useEffect(() => {
    if (auth.isAuthenticated && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [auth, location, navigate]);

  if (auth.isAuthenticated && location.pathname === "/") {
    return null;
  }

  return (
    <div className="min-h-screen">
      {
        auth.isAuthenticated && (
          <>
          
      <Header
        title={getPageTitle()}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <div className="py-10" />
          </>

        )
      }
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
              path="/reservations"
              element={
                <ProtectedRoute>
                  <ReservationsPage />
                </ProtectedRoute>
              }
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
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" Component={NotFound} />
          </Routes>
        </section>
      </main>

      {
        auth.isAuthenticated && (
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />          
        )
      }
    </div>
  );
}

export default Navigation;

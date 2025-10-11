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
  useLocation,
  useNavigate,
} from "react-router-dom";

// Import pages

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to the top whenever the route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function Navigation(): React.JSX.Element {
  return (
    <Router>
      <ScrollToTop />
      <NavigationContent />
    </Router>
  );
}

// Move useLocation inside a separate component inside Router
// How to implement page not found?
function NavigationContent() {
  let auth = useAuth();
  let navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    // This useEffect is now only for general redirection,
    // but the core fix is in the conditional rendering below.
    if (auth.isAuthenticated && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [auth, location, navigate]);

  return (
    <div className="min-h-screen">
      <Header
        title={getPageTitle()}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
         <div className="py-10" /> 
      

      <main className={`flex`}>
        <section id="mainpage" className={`flex-1`}>
          <Routes>
            <Route path="/" Component={HomePage} />
            {/* Auth Pages */}
            <Route path="/login" Component={Login} />
            <Route path="/signup" Component={Signup} />
            <Route path="/forgot-password" Component={ForgotPassword} />
            <Route path="/resetpassword" Component={ResetPassword} />
            <Route path="/verify-email" Component={OtpVerification} />

            <Route path="/menu" Component={MenuPage} />
            <Route path="/orders" Component={OrdersPage} />
            <Route path="/reservations" Component={ReservationsPage} />
            <Route path="/payments" Component={PaymentsPage} />
            <Route path="/notifications" Component={NotificationsPage} />
            <Route path="/profile" Component={ProfilePage} />

            {/* 404 Route - must be last */}
            <Route path="*" Component={NotFound} />
          </Routes>
        </section>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default Navigation;

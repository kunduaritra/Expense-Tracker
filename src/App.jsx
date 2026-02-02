import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import Login from "../src/pages/Auth/Login";
import Signup from "../src/pages/Auth/Signup";
import Dashboard from "../src/pages/Dashboard";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import CreditCards from "./pages/CreditCards";
import Reminders from "./pages/Reminders";
import {
  Home,
  ReceiptIndianRupee,
  Target,
  BarChart3,
  User,
  CreditCard,
  Bell,
} from "lucide-react";

// Protected Route Component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return user ? <Layout /> : <Navigate to="/login" replace />;
};

// Main Layout with Bottom Navigation
const Layout = () => {
  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/expenses", icon: ReceiptIndianRupee, label: "Expenses" },
    { path: "/cards", icon: CreditCard, label: "Cards" },
    { path: "/goals", icon: Target, label: "Goals" },
    { path: "/reminders", icon: Bell, label: "Reminders" }, // ADD THIS
    { path: "/insights", icon: BarChart3, label: "Insights" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;

              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExpenseProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cards" element={<CreditCards />} />
              <Route path="/reminders" element={<Reminders />} />
            </Route>

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

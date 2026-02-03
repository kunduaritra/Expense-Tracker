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
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import {
  Home,
  Receipt,
  Target,
  BarChart3,
  User,
  Landmark,
  Bell,
} from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";
import BankAccounts from "./pages/BankAccounts";
import Reminders from "./pages/Reminders";

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
    { path: "/expenses", icon: Receipt, label: "Expenses" },
    { path: "/goals", icon: Target, label: "Goals" },
    { path: "/insights", icon: BarChart3, label: "Insights" },
    { path: "/reminders", icon: Bell, label: "Reminders" },
    { path: "/banks", icon: Landmark, label: "Banks" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border z-50">
        <div
          className="flex items-center py-3 px-2 gap-1 overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.path;

            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1 flex-shrink-0 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? "text-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div
                  className={`relative ${isActive ? "text-purple-400" : ""}`}
                >
                  <Icon size={22} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full" />
                  )}
                </div>
                <span className="text-xs font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider>
      {" "}
      {/* ← NEW outer wrapper */}
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
                <Route path="/banks" element={<BankAccounts />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ExpenseProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

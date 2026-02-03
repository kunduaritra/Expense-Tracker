import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { User, Mail, LogOut, Bell, Shield, Sun, Moon } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { mode, setMode, accentId, setAccentId, ACCENT_THEMES } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Manage account & settings
        </p>
      </div>

      {/* Avatar */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center gradient-primary">
            <span className="text-3xl font-bold text-white">
              {user?.displayName?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {user?.displayName || "User"}
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* ── THEME SETTINGS ── */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>

        {/* Dark / Light toggle */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setMode("dark")}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${mode === "dark" ? "border-purple-500 bg-purple-500/10" : ""}`}
            style={{
              borderColor:
                mode === "dark" ? "var(--accent)" : "var(--border-color)",
              backgroundColor:
                mode === "dark" ? "var(--accent-light)" : "var(--bg-tertiary)",
            }}
          >
            <Moon size={18} /> <span className="text-sm font-medium">Dark</span>
          </button>
          <button
            onClick={() => setMode("light")}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${mode === "light" ? "border-purple-500 bg-purple-500/10" : ""}`}
            style={{
              borderColor:
                mode === "light" ? "var(--accent)" : "var(--border-color)",
              backgroundColor:
                mode === "light" ? "var(--accent-light)" : "var(--bg-tertiary)",
            }}
          >
            <Sun size={18} /> <span className="text-sm font-medium">Light</span>
          </button>
        </div>

        {/* Accent Colour Picker */}
        <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
          Accent Colour
        </p>
        <div className="grid grid-cols-8 gap-2">
          {ACCENT_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setAccentId(theme.id)}
              className={`w-full aspect-square rounded-xl transition-all ${accentId === theme.id ? "ring-2 ring-white ring-offset-2 scale-110" : ""}`}
              style={{
                backgroundColor: theme.primary,
                ringOffsetColor: "var(--bg-primary)",
              }}
              title={theme.name}
            />
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Currently:{" "}
          <span className="font-semibold" style={{ color: "var(--accent)" }}>
            {ACCENT_THEMES.find((t) => t.id === accentId)?.name}
          </span>
        </p>
      </Card>

      {/* Account Info */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="space-y-3">
          {[
            { icon: User, label: "Name", value: user?.displayName },
            { icon: Mail, label: "Email", value: user?.email },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <item.icon size={20} style={{ color: "var(--text-muted)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {item.label}
                </p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="space-y-2">
          {[
            { icon: Bell, label: "Notifications", value: "Enabled" },
            { icon: Shield, label: "Privacy", value: "Manage" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:opacity-80"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} style={{ color: "var(--text-muted)" }} />
                <span>{item.label}</span>
              </div>
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.value}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Sign Out */}
      <Button
        variant="danger"
        fullWidth
        size="lg"
        icon={LogOut}
        onClick={() => {
          signOut();
          navigate("/login");
        }}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default Profile;

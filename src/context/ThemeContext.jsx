import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

export const ACCENT_THEMES = [
  { id: "purple", name: "Purple", primary: "#8B5CF6", secondary: "#EC4899" },
  { id: "blue", name: "Blue", primary: "#3B82F6", secondary: "#06B6D4" },
  { id: "green", name: "Green", primary: "#10B981", secondary: "#14B8A6" },
  { id: "orange", name: "Orange", primary: "#F59E0B", secondary: "#EF4444" },
  { id: "pink", name: "Pink", primary: "#EC4899", secondary: "#8B5CF6" },
  { id: "red", name: "Red", primary: "#EF4444", secondary: "#F59E0B" },
  { id: "indigo", name: "Indigo", primary: "#6366F1", secondary: "#8B5CF6" },
  { id: "teal", name: "Teal", primary: "#14B8A6", secondary: "#3B82F6" },
];

// Every CSS variable that the app reads for colours
const buildVars = (mode, accent) => ({
  "--bg-primary": mode === "dark" ? "#0D0D0D" : "#F3F4F6",
  "--bg-secondary": mode === "dark" ? "#1A1A1A" : "#FFFFFF",
  "--bg-tertiary": mode === "dark" ? "#2D2D2D" : "#E5E7EB",
  "--border-color": mode === "dark" ? "#2D2D2D" : "#D1D5DB",
  "--text-primary": mode === "dark" ? "#FFFFFF" : "#111827",
  "--text-secondary": mode === "dark" ? "#9CA3AF" : "#6B7280",
  "--text-muted": mode === "dark" ? "#6B7280" : "#9CA3AF",
  "--accent": accent.primary,
  "--accent-light": accent.primary + "20", // 12 % opacity
  "--accent-secondary": accent.secondary,
  "--card-bg": mode === "dark" ? "#1A1A1A" : "#FFFFFF",
  "--input-bg": mode === "dark" ? "#1A1A1A" : "#F9FAFB",
  "--success": "#10B981",
  "--warning": "#F59E0B",
  "--error": "#EF4444",
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    () => localStorage.getItem("theme_mode") || "dark",
  );
  const [accentId, setAccentId] = useState(
    () => localStorage.getItem("theme_accent") || "purple",
  );

  const accent =
    ACCENT_THEMES.find((t) => t.id === accentId) || ACCENT_THEMES[0];

  // Apply CSS variables + dark class every time mode / accent changes
  useEffect(() => {
    const root = document.documentElement;

    // toggle Tailwind dark class
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    // write CSS vars
    const vars = buildVars(mode, accent);
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

    // persist
    localStorage.setItem("theme_mode", mode);
    localStorage.setItem("theme_accent", accentId);
  }, [mode, accentId, accent]);

  // Run once on mount so the page doesn't flash
  useEffect(() => {
    const root = document.documentElement;
    const vars = buildVars(mode, accent);
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, []); // eslint-disable-line

  return (
    <ThemeContext.Provider
      value={{ mode, setMode, accent, accentId, setAccentId, ACCENT_THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

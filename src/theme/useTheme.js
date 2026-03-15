import { useContext } from "react";
import { ThemeContext } from "./ThemeContext.js";

// Povides an easy way for components to access the theme context.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

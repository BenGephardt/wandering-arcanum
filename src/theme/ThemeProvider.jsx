import { useEffect, useMemo, useState, useCallback } from "react";
import { ThemeContext } from "./ThemeContext.js";
import { THEME_MODES, THEME_STORAGE_KEY } from "./themeConstants.js";

// Retrieves the initial theme from localStorage or defaults to LIGHT if not set or on error.
function getInitialTheme() {
  if (typeof window === "undefined") {
    return THEME_MODES.LIGHT;
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (
      stored === THEME_MODES.LIGHT ||
      stored === THEME_MODES.DARK ||
      stored === THEME_MODES.DARKVISION
    ) {
      return stored;
    }
  } catch {
    // ignore localStorage errors
  }

  return THEME_MODES.LIGHT;
}

// ThemeProvider manages the application's theme state and provides it to child components via context.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore localStorage errors
    }
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((current) => {
      if (current === THEME_MODES.LIGHT) return THEME_MODES.DARK;
      if (current === THEME_MODES.DARK) return THEME_MODES.DARKVISION;
      return THEME_MODES.LIGHT;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      cycleTheme,
      THEME_MODES,
    }),
    [theme, cycleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

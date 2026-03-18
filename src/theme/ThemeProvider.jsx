import { useEffect, useState, useCallback, useMemo } from "react";
import { ThemeContext } from "./ThemeContext.js";
import { THEME_MODES, THEME_STORAGE_KEY } from "./themeConstants.js";

// Validates and retrieves the theme from storage.
function getInitialTheme() {
  // Server-side rendering guard
  if (typeof window === "undefined") return THEME_MODES.LIGHT;

  // Attempt to load the theme from localStorage, with validation and error handling.
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const validThemes = Object.values(THEME_MODES);
    return validThemes.includes(stored) ? stored : THEME_MODES.LIGHT;
  } catch {
    return THEME_MODES.LIGHT;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Synchronize state with the DOM and LocalStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    // Attempt to save the theme to localStorage, with error handling for quota issues or private browsing.
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn(
        "Wandering Arcanum: Theme could not be saved to the Weave.",
        error,
      );
    }
  }, [theme]);

  // Declarative cycling logic
  const cycleTheme = useCallback(() => {
    const NEXT_THEME = {
      [THEME_MODES.LIGHT]: THEME_MODES.DARK,
      [THEME_MODES.DARK]: THEME_MODES.DARKVISION,
      [THEME_MODES.DARKVISION]: THEME_MODES.LIGHT,
    };
    setTheme((current) => NEXT_THEME[current] || THEME_MODES.LIGHT);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders in consumers.
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

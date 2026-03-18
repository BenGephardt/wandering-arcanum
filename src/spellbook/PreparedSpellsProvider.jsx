import { useEffect, useState, useCallback, useMemo } from "react";
import { PreparedSpellsContext } from "./PreparedSpellsContext.js";
import { PREPARED_SPELLS_STORAGE_KEY } from "./spellbookConstants.js";

// Provider component that manages the state of prepared spells and syncs it with localStorage.
function getInitialPreparedSpells() {
  if (typeof window === "undefined") return [];

  // Attempt to load prepared spells from localStorage, with error handling for malformed data.
  try {
    const stored = window.localStorage.getItem(PREPARED_SPELLS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Wandering Arcanum: Could not parse prepared spells.", error);
    return [];
  }
}

// The PreparedSpellsProvider component wraps parts of the app that need access to prepared spells state.
export function PreparedSpellsProvider({ children }) {
  const [preparedSpells, setPreparedSpells] = useState(
    getInitialPreparedSpells,
  );

  // Sync state to localStorage whenever the spellbook changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        PREPARED_SPELLS_STORAGE_KEY,
        JSON.stringify(preparedSpells),
      );
    } catch (error) {
      console.warn(
        "Wandering Arcanum: Failed to save to the Weave (localStorage).",
        error,
      );
    }
  }, [preparedSpells]);

  // Stable callback for adding a spell (with duplicate protection)
  const addSpell = useCallback((spell) => {
    setPreparedSpells((current) => {
      const isDuplicate = current.some((s) => s.index === spell.index);
      return isDuplicate ? current : [...current, spell];
    });
  }, []);

  // Stable callback for removing a spell by index
  const removeSpell = useCallback((index) => {
    setPreparedSpells((current) =>
      current.filter((spell) => spell.index !== index),
    );
  }, []);

  // Stable callback for wiping the spellbook
  const clearSpells = useCallback(() => {
    setPreparedSpells([]);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders in consumers.
  const value = useMemo(
    () => ({
      preparedSpells,
      addSpell,
      removeSpell,
      clearSpells,
    }),
    [preparedSpells, addSpell, removeSpell, clearSpells],
  );

  return (
    <PreparedSpellsContext.Provider value={value}>
      {children}
    </PreparedSpellsContext.Provider>
  );
}

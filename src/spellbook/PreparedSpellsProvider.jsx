import { useEffect, useMemo, useState, useCallback } from "react";
import { PreparedSpellsContext } from "./PreparedSpellsContext.js";
import { PREPARED_SPELLS_STORAGE_KEY } from "./spellbookConstants.js";

// Manages the state of prepared spells and provides functions to add, remove, and clear spells.
function getInitialPreparedSpells() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(PREPARED_SPELLS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore parse/storage errors
  }
  return [];
}

export function PreparedSpellsProvider({ children }) {
  const [preparedSpells, setPreparedSpells] = useState(
    getInitialPreparedSpells,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        PREPARED_SPELLS_STORAGE_KEY,
        JSON.stringify(preparedSpells),
      );
    } catch {
      // ignore storage errors
    }
  }, [preparedSpells]);

  const addSpell = useCallback((spell) => {
    setPreparedSpells((current) => {
      if (current.some((s) => s.index === spell.index)) {
        return current;
      }
      return [...current, spell];
    });
  }, []);

  const removeSpell = useCallback((index) => {
    setPreparedSpells((current) =>
      current.filter((spell) => spell.index !== index),
    );
  }, []);

  const clearSpells = useCallback(() => {
    setPreparedSpells([]);
  }, []);

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

import { useContext } from "react";
import { PreparedSpellsContext } from "./PreparedSpellsContext.js";

// Provides an easy way for components to access the prepared spells context.
export function usePreparedSpells() {
  const ctx = useContext(PreparedSpellsContext);
  if (!ctx) {
    throw new Error(
      "usePreparedSpells must be used within a PreparedSpellsProvider"
    );
  }
  return ctx;
}
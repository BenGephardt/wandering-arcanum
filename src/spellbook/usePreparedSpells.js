import { useContext } from "react";
import { PreparedSpellsContext } from "./PreparedSpellsContext.js";

export function usePreparedSpells() {
  const ctx = useContext(PreparedSpellsContext);
  if (!ctx) {
    throw new Error(
      "usePreparedSpells must be used within a PreparedSpellsProvider"
    );
  }
  return ctx;
}
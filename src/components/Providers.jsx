import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import { PreparedSpellsProvider } from "./spellbook/PreparedSpellsProvider.jsx";
import { BrowserRouter } from "react-router-dom";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <PreparedSpellsProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </PreparedSpellsProvider>
    </ThemeProvider>
  );
}
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import { PreparedSpellsProvider } from "./spellbook/PreparedSpellsProvider.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <PreparedSpellsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PreparedSpellsProvider>
    </ThemeProvider>
  </StrictMode>,
);

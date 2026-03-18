import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "./components/Providers.jsx";
import App from "./App.jsx";
import "./index.css";

// The main entry point of the application.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);

// -- Service Worker Registration for PWA Capabilities ---
// Checks if the browser actually supports Service Workers
if ("serviceWorker" in navigator) {
  // Waits until page loads to avoid blocking critical rendering
  window.addEventListener("load", () => {
    // Attempts to register the Service Worker located at /sw.js
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Wizard summoned: Service Worker registered successfully.",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error(
          "Summoning failed: Service Worker registration failed:",
          error,
        );
      });
  });
}

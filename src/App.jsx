// src/App.jsx
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import MySpellbookPage from "./pages/MySpellbookPage.jsx";
import SpellDetailPage from "./pages/SpellDetailPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/my-spellbook" element={<MySpellbookPage />} />
        <Route path="/spell/:index" element={<SpellDetailPage />} />
        <Route
          path="*"
          element={
            <div>
              <h2>404: Page Not Found</h2>
              <p>This page does not exist in the Wandering Arcanum.</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

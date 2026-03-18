import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import MySpellbookPage from "./pages/MySpellbookPage.jsx";
import SpellDetailPage from "./pages/SpellDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// The main application component that sets up routing and layout.
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Define routes for the main pages of the application. */}
        <Route path="/" element={<BrowsePage />} />
        {/* The My Spellbook page where users can view their prepared spells. */}
        <Route path="/my-spellbook" element={<MySpellbookPage />} />
        {/* The Spell Detail page where users can view details of a specific spell. */}
        <Route path="/spell/:index" element={<SpellDetailPage />} />
        {/* Catch-all route for undefined paths, displaying a 404 page. */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import MySpellbookPage from "./pages/MySpellbookPage.jsx";
import SpellDetailPage from "./pages/SpellDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx"; // 📍 Clean import

function App() {
  return (
    <Routes>
      {/* Wrap all pages in the AppLayout. 
        This is where the "Arcane" theme lives! 
      */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/my-spellbook" element={<MySpellbookPage />} />
        <Route path="/spell/:index" element={<SpellDetailPage />} />

        {/* 📍 Clean catch-all component */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

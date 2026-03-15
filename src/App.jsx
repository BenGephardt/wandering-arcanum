import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import MySpellbookPage from "./pages/MySpellbookPage.jsx";
import SpellDetailPage from "./pages/SpellDetailPage.jsx";

// The App component serves as the root of the application, defining the main routes and layout. It uses React Router to set up navigation between the BrowsePage, MySpellbookPage, and SpellDetailPage. The AppLayout component wraps these pages to provide a consistent header and navigation experience across the application. Additionally, a catch-all route is included to display a 404 message for any undefined routes, ensuring that users are informed when they navigate to a non-existent page within the Wandering Arcanum.
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

import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../theme/useTheme.js";
import { THEME_MODES } from "../theme/themeConstants.js";
import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";
import "./AppLayout.css";

function AppLayout() {
  const { theme, cycleTheme } = useTheme();
  const { preparedSpells } = usePreparedSpells();

  const nextLabel =
    theme === THEME_MODES.LIGHT
      ? "Switch to Dark Mode"
      : theme === THEME_MODES.DARK
        ? "Switch to Darkvision Mode"
        : "Switch to Light Mode";

  const buttonText =
    theme === THEME_MODES.LIGHT
      ? "Light"
      : theme === THEME_MODES.DARK
        ? "Dark"
        : "Darkvision";

  const preparedCount = preparedSpells.length;

  return (
    <div className="app-root">
      <header className="app-header" role="banner">
        <div className="app-header-left">
          <h1 className="app-title">Wandering Arcanum</h1>
          <p className="app-subtitle">D&D 5e Spell Browser & Spellbook</p>
        </div>

        <div className="app-header-right">
          <nav className="app-nav" aria-label="Main navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "app-nav-link" + (isActive ? " app-nav-link-active" : "")
              }
              end
            >
              Browse
            </NavLink>
            <NavLink
              to="/my-spellbook"
              className={({ isActive }) =>
                "app-nav-link" + (isActive ? " app-nav-link-active" : "")
              }
            >
              My Spellbook
              {preparedCount > 0 && (
                <span
                  className="app-nav-badge"
                  aria-label={`${preparedCount} prepared spells`}
                >
                  {preparedCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Theme Toggle will be rendered here */}
          <button
            type="button"
            className="theme-toggle"
            onClick={cycleTheme}
            aria-label={nextLabel}
          >
            {buttonText}
          </button>
        </div>
      </header>

      <div className="app-layout-body">
        {/* Sidebar placeholder for filters on Browse page */}
        <aside className="app-sidebar" aria-label="Filters">
          <p className="sidebar-placeholder">Sidebar filters will go here.</p>
        </aside>

        {/* Main content area where routed pages render */}
        <main className="app-main" role="main">
          <Outlet />{" "}
          {/* Where the specific page components (BrowsePage, MySpellbookPage) will render */}
        </main>
      </div>

      <footer className="app-footer">
        <p>Wandering Arcanum • Built with React & Vite</p>
      </footer>
    </div>
  );
}

export default AppLayout;

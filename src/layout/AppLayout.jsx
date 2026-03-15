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
    <div className="app-root layout">
      <header className="app-header" role="banner">
        <div className="header-inner">
          <div className="brand">
            {/* The new brand lockup from your old CSS */}
            <div className="brand-mark">
              <span className="brand-kicker">Wandering Arcanum</span>
              <span className="brand-main">Spell Browser</span>
              <span className="brand-sub">D&D 5e</span>
            </div>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
              end
            >
              Browse
            </NavLink>
            <NavLink
              to="/my-spellbook"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
            >
              My Spellbook
              {preparedCount > 0 && (
                <span className="pill-count">{preparedCount}</span>
              )}
            </NavLink>

            {/* Using your classic .btn and .btn-ghost classes! */}
            <button
              type="button"
              className="btn btn-ghost theme-toggle"
              onClick={cycleTheme}
              aria-label={nextLabel}
            >
              {buttonText}
            </button>
          </nav>
        </div>
      </header>

      <main className="layout-main" role="main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>Wandering Arcanum • Built with React & Vite</p>
      </footer>
    </div>
  );
}

export default AppLayout;

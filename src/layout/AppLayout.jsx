import { Link, NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../theme/useTheme.js";
import { THEME_MODES } from "../theme/themeConstants.js";
import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";
import "./AppLayout.css";

// Centralized UI configuration for theme modes.
const THEME_UI_CONFIG = {
  [THEME_MODES.LIGHT]: {
    buttonText: "Torchlight",
    nextLabel: "Switch to Torchlight",
  },
  [THEME_MODES.DARK]: {
    buttonText: "Darkvision",
    nextLabel: "Switch to Darkvision",
  },
  [THEME_MODES.DARKVISION]: {
    buttonText: "Daylight",
    nextLabel: "Switch to Daylight",
  },
};

// Handles active class logic for NavLinks.
const getNavLinkClass = ({ isActive }) =>
  `nav-link${isActive ? " nav-link-active" : ""}`;

// The structural framework of Wandering Arcanum.
function AppLayout() {
  // Hooks for theme and spellbook state.
  const { theme, cycleTheme } = useTheme();
  const { preparedSpells } = usePreparedSpells();
  const { buttonText, nextLabel } = THEME_UI_CONFIG[theme];
  const preparedCount = preparedSpells.length;

  return (
    <div className="app-root layout">
      <header className="app-header" role="banner">
        <div className="header-inner">
          <div className="brand">
            <Link to="/" className="brand-mark">
              <span className="brand-main">
                Wandering <span className="text-accent">Arcanum</span>
              </span>
              <span className="brand-sub">
                A Spellbook and Browser <span className="brand-divider">✦</span>{" "}
                5e
              </span>
            </Link>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <NavLink
              to="/"
              className={getNavLinkClass}
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              end
            >
              Browse
            </NavLink>

            <NavLink
              to="/my-spellbook"
              className={getNavLinkClass}
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            >
              My Spellbook
              {preparedCount > 0 && (
                <span className="pill-count">{preparedCount}</span>
              )}
            </NavLink>

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

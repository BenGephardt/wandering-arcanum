import "./App.css";
import { useTheme } from "./theme/useTheme.js";
import { THEME_MODES } from "./theme/themeConstants.js";

function App() {
  const { theme, cycleTheme } = useTheme();

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

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1 className="app-title">Wandering Arcanum</h1>
          <p className="app-subtitle">
            D&D 5e Spell Browser & Spellbook – Theme Demo
          </p>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={cycleTheme}
          aria-label={nextLabel}
        >
          {buttonText}
        </button>
      </header>

      <main className="app-main">
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <p>
          A polished React-based D&D 5e spell browser and management tool. It
          uses the public D&D 5e API as its only data source and presents
          everything in an immersive “arcane grimoire” UI.
        </p>
      </main>
    </div>
  );
}

export default App;

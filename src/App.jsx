import "./App.css";
import { useTheme } from "./theme/useTheme.js";
import { THEME_MODES } from "./theme/themeConstants.js";
import { usePreparedSpells } from "./spellbook/usePreparedSpells.js";

function App() {
  const { theme, cycleTheme } = useTheme();
  const {
    preparedSpells,
    addSpell,
    removeSpell,
    clearSpells,
  } = usePreparedSpells();

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

  // Example "fake" spells to demonstrate add/remove
  const demoSpells = [
    {
      index: "fire-bolt",
      name: "Fire Bolt",
      level: 0,
      school: "Evocation",
    },
    {
      index: "magic-missile",
      name: "Magic Missile",
      level: 1,
      school: "Evocation",
    },
    {
      index: "shield",
      name: "Shield",
      level: 1,
      school: "Abjuration",
    },
  ];

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1 className="app-title">Wandering Arcanum</h1>
          <p className="app-subtitle">
            D&D 5e Spell Browser & Spellbook – Theme & Spellbook Demo
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
        <section style={{ marginBottom: "24px" }}>
          <h2>Prepared Spells (Persisted)</h2>
          {preparedSpells.length === 0 ? (
            <p>No spells prepared yet.</p>
          ) : (
            <ul>
              {preparedSpells.map((spell) => (
                <li key={spell.index}>
                  <strong>{spell.name}</strong> (Level {spell.level},{" "}
                  {spell.school}){" "}
                  <button
                    type="button"
                    onClick={() => removeSpell(spell.index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {preparedSpells.length > 0 && (
            <button type="button" onClick={clearSpells}>
              Clear All Prepared Spells
            </button>
          )}
        </section>

        <section>
          <h2>Demo Spells (Click to Prepare)</h2>
          <ul>
            {demoSpells.map((spell) => (
              <li key={spell.index}>
                <strong>{spell.name}</strong> (Level {spell.level},{" "}
                {spell.school}){" "}
                <button type="button" onClick={() => addSpell(spell)}>
                  Prepare Spell
                </button>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "12px" }}>
            Add some spells, refresh the page, and confirm they remain in the
            Prepared Spells list.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;


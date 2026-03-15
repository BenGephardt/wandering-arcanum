import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";
import SpellCard from "../components/SpellCard.jsx";
import "./MySpellbookPage.css";

function MySpellbookPage() {
  const { preparedSpells, removeSpell, clearSpells } = usePreparedSpells();

  const hasSpells = preparedSpells.length > 0;

  return (
    <section className="page-spellbook">
      <header className="page-spellbook-header">
        <h2 className="page-title">My Spellbook</h2>
        {hasSpells && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={clearSpells}
          >
            Clear All
          </button>
        )}
      </header>

      {!hasSpells ? (
        <p className="empty-state">
          You have no prepared spells yet. Browse the index and prepare a few.
        </p>
      ) : (
        <div
          className="spell-grid"
          role="list"
          aria-label="Prepared spells"
        >
          {preparedSpells.map((spell) => (
            <SpellCard
              key={spell.index}
              spell={spell}
              actionLabel="Remove"
              onAction={() => removeSpell(spell.index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MySpellbookPage;
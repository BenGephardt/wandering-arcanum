import { Link } from "react-router-dom";
import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";
import SpellCard from "../components/SpellCard.jsx";
import "./MySpellbookPage.css";

function MySpellbookPage() {
  const { preparedSpells, removeSpell, clearSpells } = usePreparedSpells();
  const hasSpells = preparedSpells.length > 0;

  // Early Return for the Empty State
  if (!hasSpells) {
    return (
      <section className="page-spellbook">
        <header className="page-spellbook-header">
          <h2 className="page-title">My Spellbook</h2>
        </header>
        <div className="empty-state-container">
          <p className="empty-state-text">
            Consult the Weave to bind this page with spells. Unless hurling a
            blank tome is your next plan of action, browse the index and ready
            your magic.
          </p>
          <Link to="/" className="btn btn-ghost">
            Browse the Index
          </Link>
        </div>
      </section>
    );
  }

  // Main Render for Prepared Spells
  return (
    <section className="page-spellbook">
      <header className="page-spellbook-header">
        <h2 className="page-title">My Spellbook</h2>
        <button type="button" className="btn btn-ghost" onClick={clearSpells}>
          Clear All
        </button>
      </header>

      <div className="spell-grid" role="list" aria-label="Prepared spells">
        {preparedSpells.map((spell) => (
          <SpellCard
            key={spell.index}
            spell={spell}
            actionLabel="Remove"
            onAction={() => removeSpell(spell.index)}
          />
        ))}
      </div>
    </section>
  );
}

export default MySpellbookPage;

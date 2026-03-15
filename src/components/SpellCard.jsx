import { Link } from "react-router-dom";
import "./SpellCard.css";

function SpellCard({ spell, onPrepare, isPrepared }) {
  const { index, name, level, school, classes } = spell;

  const levelLabel = level === 0 ? "Cantrip" : `Level ${level}`;
  const schoolName = school?.name || spell.school?.name || "Unknown";
  const classNames = classes?.map((c) => c.name).join(", ") || "—";

  return (
    <article className="spell-card" role="listitem">
      <header className="spell-card-header">
        <h3 className="spell-card-title">
          <Link to={`/spell/${index}`}>{name}</Link>
        </h3>
        <p className="spell-card-meta">
          {levelLabel} • {schoolName}
        </p>
      </header>

      <p className="spell-card-classes">
        <span className="label">Classes:</span> {classNames}
      </p>

      <div className="spell-card-actions">
        <Link to={`/spell/${index}`} className="spell-card-link">
          View details
        </Link>
        <button
          type="button"
          className="spell-card-prepare"
          onClick={() => onPrepare(spell)}
          disabled={isPrepared}
        >
          {isPrepared ? "Prepared" : "Prepare Spell"}
        </button>
      </div>
    </article>
  );
}

export default SpellCard;

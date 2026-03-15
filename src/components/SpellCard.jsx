import { Link } from "react-router-dom";
import "./SpellCard.css";

function SpellCard({ spell, actionLabel, onAction, disabled = false }) {
  const { index, name, level, school, classes } = spell;

  const levelLabel = level === 0 ? "Cantrip" : `Level ${level}`;
  const schoolIndex = school?.index || "universal";
  const schoolName = school?.name || "Unknown";
  const classNames = classes?.map((c) => c.name).join(", ") || "—";

  // Map the classic CSS school colors directly to the card's border
  const cardStyle = {
    borderColor: `var(--color-school-${schoolIndex}, var(--color-border-card))`,
  };

  return (
    <article className="spell-card" role="listitem" style={cardStyle}>
      <div className="spell-card-inner">
        <h3 className="spell-title">
          <Link to={`/spell/${index}`} className="spell-title-link">
            {name}
          </Link>
        </h3>

        <dl className="spell-meta">
          <div className="spell-meta-row">
            <dt>Level</dt>
            <dd>{levelLabel}</dd>
          </div>
          <div className="spell-meta-row">
            <dt>School</dt>
            <dd>{schoolName}</dd>
          </div>
          <div className="spell-meta-row">
            <dt>Classes</dt>
            <dd>{classNames}</dd>
          </div>
        </dl>

        <div className="spell-card-actions">
          {/* Using your classic .btn and .btn-primary classes! */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onAction(spell)}
            disabled={disabled}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

export default SpellCard;
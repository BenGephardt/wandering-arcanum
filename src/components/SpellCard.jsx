import { Link } from "react-router-dom";
import { useMemo } from "react";
import "./SpellCard.css";

// A reusable card component for displaying spell information in a consistent format.
function SpellCard({ spell, actionLabel, onAction, disabled = false }) {
  const { index, name, level, school, classes } = spell;

  const levelLabel = useMemo(
    () => (level === 0 ? "Cantrip" : `Level ${level}`),
    [level],
  );

  const { schoolIndex, schoolName } = useMemo(
    () => ({
      schoolIndex: school?.index || "universal",
      schoolName: school?.name || "Unknown",
    }),
    [school],
  );

  const classNames = useMemo(
    () => classes?.map((c) => c.name).join(", ") || "—",
    [classes],
  );

  const cardStyle = useMemo(
    () => ({
      borderColor: `var(--color-school-${schoolIndex}, var(--color-border-card))`,
    }),
    [schoolIndex],
  );

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

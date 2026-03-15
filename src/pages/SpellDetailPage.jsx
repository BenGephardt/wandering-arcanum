import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";
import "./SpellDetailPage.css";

const API_BASE = "https://www.dnd5eapi.co";

// Responsible for displaying detailed information about a specific spell.
function SpellDetailPage() {
  const { index } = useParams();
  const [spell, setSpell] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { preparedSpells, addSpell, removeSpell } = usePreparedSpells();
  const isPrepared = preparedSpells.some((s) => s.index === index);

  useEffect(() => {
    let cancelled = false;

    async function fetchSpell() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/api/spells/${index}`);
        if (!res.ok) throw new Error("Failed to fetch spell details");
        const data = await res.json();
        if (!cancelled) setSpell(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Unable to load this spell. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSpell();
    return () => { cancelled = true; };
  }, [index]);

  if (loading) {
    return <p className="status status-loading">Consulting the Weave...</p>;
  }

  if (error) {
    return <p className="status status-error">{error}</p>;
  }

  if (!spell) {
    return <p className="status status-error">Spell not found.</p>;
  }

  const levelLabel = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
  const schoolName = spell.school?.name || "Unknown";
  const classNames = spell.classes?.map((c) => c.name).join(", ") || "—";

  const handlePrepareClick = () => {
    if (isPrepared) {
      removeSpell(spell.index);
    } else {
      addSpell({
        index: spell.index,
        name: spell.name,
        level: spell.level,
        school: spell.school,
        classes: spell.classes,
      });
    }
  };

  return (
    <article className="page-detail">
      <header className="detail-header">
        <h2 className="page-title" style={{ marginBottom: "0.25rem" }}>
          {spell.name}
        </h2>
        <p className="detail-sub">
          {levelLabel} • {schoolName}
        </p>

        <div>
          <button
            type="button"
            className={`btn ${isPrepared ? "btn-ghost" : "btn-primary"}`}
            onClick={handlePrepareClick}
          >
            {isPrepared ? "Remove from Spellbook" : "Prepare Spell"}
          </button>
        </div>
      </header>

      <div className="detail-grid">
        <aside>
          <dl className="detail-stats">
            <div className="detail-stat">
              <dt>Classes</dt>
              <dd>{classNames}</dd>
            </div>
            <div className="detail-stat">
              <dt>Casting Time</dt>
              <dd>{spell.casting_time}</dd>
            </div>
            <div className="detail-stat">
              <dt>Range</dt>
              <dd>{spell.range}</dd>
            </div>
            <div className="detail-stat">
              <dt>Components</dt>
              <dd>
                {spell.components?.join(", ")}
                {spell.material && ` (${spell.material})`}
              </dd>
            </div>
            <div className="detail-stat">
              <dt>Duration</dt>
              <dd>{spell.duration}</dd>
            </div>
            <div className="detail-stat">
              <dt>Concentration</dt>
              <dd>{spell.concentration ? "Yes" : "No"}</dd>
            </div>
            <div className="detail-stat">
              <dt>Ritual</dt>
              <dd>{spell.ritual ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </aside>

        <section className="detail-description">
          <h3 className="section-title">Description</h3>
          {spell.desc?.map((para, i) => (
            <p key={i}>{para}</p>
          ))}

          {spell.higher_level && spell.higher_level.length > 0 && (
            <>
              <h4 className="section-subtitle">At Higher Levels</h4>
              {spell.higher_level.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </>
          )}
        </section>
      </div>
    </article>
  );
}

export default SpellDetailPage;
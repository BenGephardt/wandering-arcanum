import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";
import "./SpellDetailPage.css";

const API_BASE = "https://www.dnd5eapi.co";

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
        if (!cancelled) {
          setSpell(data);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Unable to load this spell. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSpell();

    return () => {
      cancelled = true;
    };
  }, [index]);

  if (loading) {
    return (
      <section className="page page-spell-detail">
        <p>Consulting the Weave...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page page-spell-detail">
        <p className="error-text">{error}</p>
      </section>
    );
  }

  if (!spell) {
    return (
      <section className="page page-spell-detail">
        <p className="error-text">Spell not found.</p>
      </section>
    );
  }

  const levelLabel =
    spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
  const schoolName = spell.school?.name || "Unknown";
  const classNames =
    spell.classes?.map((c) => c.name).join(", ") || "—";

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
    <section className="page page-spell-detail">
      <header className="spell-detail-header">
        <h2 className="spell-detail-title">{spell.name}</h2>
        <p className="spell-detail-meta">
          {levelLabel} • {schoolName}
        </p>
        <p className="spell-detail-meta">
          <span className="label">Classes:</span> {classNames}
        </p>

        <button
          type="button"
          className="spell-detail-prepare"
          onClick={handlePrepareClick}
        >
          {isPrepared ? "Remove from Spellbook" : "Prepare Spell"}
        </button>
      </header>

      <dl className="spell-detail-stats">
        <div>
          <dt>Casting Time</dt>
          <dd>{spell.casting_time}</dd>
        </div>
        <div>
          <dt>Range</dt>
          <dd>{spell.range}</dd>
        </div>
        <div>
          <dt>Components</dt>
          <dd>
            {spell.components?.join(", ")}
            {spell.material && ` (${spell.material})`}
          </dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{spell.duration}</dd>
        </div>
        <div>
          <dt>Concentration</dt>
          <dd>{spell.concentration ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt>Ritual</dt>
          <dd>{spell.ritual ? "Yes" : "No"}</dd>
        </div>
      </dl>

      <section className="spell-detail-description">
        <h3>Description</h3>
        {spell.desc?.map((para, i) => (
          <p key={i}>{para}</p>
        ))}

        {spell.higher_level && spell.higher_level.length > 0 && (
          <>
            <h3>At Higher Levels</h3>
            {spell.higher_level.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </>
        )}
      </section>
    </section>
  );
}

export default SpellDetailPage;

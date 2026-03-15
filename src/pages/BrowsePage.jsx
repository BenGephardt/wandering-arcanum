import { useEffect, useMemo, useState } from "react";
import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";
import SpellCard from "../components/SpellCard.jsx";
import "./BrowsePage.css";

const API_BASE = "https://www.dnd5eapi.co";

// Responsible for fetching and enriching spells from the D&D 5e API.
function BrowsePage() {
  const [enrichedSpells, setEnrichedSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");

  const { preparedSpells, addSpell } = usePreparedSpells();

  // Fetch the list of spells and their details when the component mounts.
  useEffect(() => {
    let cancelled = false;

    async function fetchSpells() {
      setLoading(true);
      setError("");

      // Fetch the first 150 spells to limit the number of requests and data we need to handle.tails.
      try {
        const res = await fetch(`${API_BASE}/api/spells`);
        if (!res.ok) throw new Error("Failed to fetch spell index");
        const data = await res.json();
        if (cancelled) return;

        const results = data.results || [];
        const firstBatch = results.slice(0, 150);

        const detailPromises = firstBatch.map(async (spell) => {
          try {
            const detailRes = await fetch(`${API_BASE}${spell.url}`);
            if (!detailRes.ok) throw new Error("Failed to fetch spell detail");
            const detail = await detailRes.json();
            return {
              index: detail.index,
              name: detail.name,
              level: detail.level,
              school: detail.school,
              classes: detail.classes,
            };
          } catch {
            return {
              index: spell.index,
              name: spell.name,
              level: null,
              school: null,
              classes: [],
            };
          }
        });

        // Waits for all detail requests to complete and enrich the spells with their details.
        const enriched = await Promise.all(detailPromises);
        if (!cancelled) {
          setEnrichedSpells(enriched);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Unable to fetch spells. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Fetch spells when the component mounts.
    fetchSpells();
    return () => {
      cancelled = true;
    };
  }, []);

  // Computes the list of spells to display based on the current search query and filter selections.
  const filteredSpells = useMemo(() => {
    let list = enrichedSpells;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((spell) => spell.name.toLowerCase().includes(q));
    }

    if (levelFilter !== "all") {
      const levelNum = Number(levelFilter);
      list = list.filter((spell) => spell.level === levelNum);
    }

    if (schoolFilter !== "all") {
      list = list.filter(
        (spell) => spell.school && spell.school.index === schoolFilter,
      );
    }

    if (classFilter !== "all") {
      list = list.filter((spell) =>
        spell.classes?.some((c) => c.index === classFilter),
      );
    }

    return list;
  }, [enrichedSpells, search, levelFilter, schoolFilter, classFilter]);

  // Defines the options for the level, school, and class filters.
  const levelOptions = [
    { value: "all", label: "All Levels" },
    { value: "0", label: "Cantrip" },
    { value: "1", label: "1st" },
    { value: "2", label: "2nd" },
    { value: "3", label: "3rd" },
    { value: "4", label: "4th" },
    { value: "5", label: "5th" },
    { value: "6", label: "6th" },
    { value: "7", label: "7th" },
    { value: "8", label: "8th" },
    { value: "9", label: "9th" },
  ];

  const schoolOptions = useMemo(() => {
    const unique = new Map();
    enrichedSpells.forEach((spell) => {
      if (spell.school) unique.set(spell.school.index, spell.school.name);
    });
    return [
      { value: "all", label: "All Schools" },
      ...Array.from(unique.entries()).map(([value, label]) => ({
        value,
        label,
      })),
    ];
  }, [enrichedSpells]);

  const classOptions = useMemo(() => {
    const unique = new Map();
    enrichedSpells.forEach((spell) => {
      (spell.classes || []).forEach((cls) => {
        unique.set(cls.index, cls.name);
      });
    });
    return [
      { value: "all", label: "All Classes" },
      ...Array.from(unique.entries()).map(([value, label]) => ({
        value,
        label,
      })),
    ];
  }, [enrichedSpells]);

  const resetFilters = () => {
    setSearch("");
    setLevelFilter("all");
    setSchoolFilter("all");
    setClassFilter("all");
  };

  // Renders the browse page with a sidebar for filters and a main section for displaying spells.
  return (
    <div className="page-browse">
      <aside className="sidebar-filters" aria-label="Spell filters">
        <h2 className="page-title">Spell Index</h2>

        {/* --- FILTER FIELDS --- */}
        <label className="field">
          <span className="field-label">Search</span>
          <input
            type="text"
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
          />
        </label>

        <label className="field">
          <span className="field-label">Level</span>
          <select
            className="input input-select"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            {levelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">School</span>
          <select
            className="input input-select"
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
          >
            {schoolOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Class</span>
          <select
            className="input input-select"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            {classOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </aside>

      {/* --- SPELL GRID & STATES --- */}
      <section className="spell-grid-section">
        {loading && (
          <p className="status status-loading">Consulting the Weave...</p>
        )}
        {!loading && error && (
          <p className="status status-error">{error}</p>
        )}
        
        {!loading && !error && (
          <>
            {filteredSpells.length === 0 ? (
              <div className="empty-state-container">
                <p className="empty-state-text">
                  The Weave reveals a magical void. No spell matches these parameters in our current mortal world.
                </p>
                <button 
                  className="btn btn-ghost" 
                  onClick={resetFilters} 
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <p className="field-label" style={{ marginBottom: "1rem" }}>
                  Showing {filteredSpells.length} of {enrichedSpells.length} spells
                </p>
                <div
                  className="spell-grid"
                  role="list"
                  aria-label="Spell search results"
                >
                  {filteredSpells.map((spell) => {
                    const isPrepared = preparedSpells.some(
                      (s) => s.index === spell.index,
                    );

                    return (
                      <SpellCard
                        key={spell.index}
                        spell={spell}
                        actionLabel={isPrepared ? "Prepared" : "Prepare Spell"}
                        onAction={addSpell}
                        disabled={isPrepared}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default BrowsePage;
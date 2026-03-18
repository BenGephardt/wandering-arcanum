import { useEffect, useMemo, useState, useRef } from "react";
import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";
import SpellCard from "../components/SpellCard.jsx";
import "./BrowsePage.css";

const API_BASE = "https://www.dnd5eapi.co";

function BrowsePage() {
  const [masterRoster, setMasterRoster] = useState([]);
  const [displayedSpells, setDisplayedSpells] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");

  const { preparedSpells, addSpell } = usePreparedSpells();
  const scrollPositionRef = useRef(0);

  // 1. Fetch the master list using the Intersection Strategy
  useEffect(() => {
    let cancelled = false;
    async function fetchRoster() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (levelFilter !== "all") params.append("level", levelFilter);
      if (schoolFilter !== "all") params.append("school", schoolFilter);
      
      const queryString = params.toString();
      const baseSpellsUrl = queryString ? `${API_BASE}/api/spells?${queryString}` : `${API_BASE}/api/spells`;
      const classSpellsUrl = classFilter !== "all" ? `${API_BASE}/api/classes/${classFilter}/spells` : null;

      try {
        const [baseRes, classRes] = await Promise.all([
          fetch(baseSpellsUrl),
          classSpellsUrl ? fetch(classSpellsUrl) : Promise.resolve(null)
        ]);

        if (!baseRes.ok) throw new Error("Failed to fetch base spells");
        const baseData = await baseRes.json();
        let finalRoster = baseData.results || [];

        if (classRes) {
          if (!classRes.ok) throw new Error("Failed to fetch class spells");
          const classData = await classRes.json();
          const classSpellIndexes = new Set(classData.results.map(s => s.index));
          finalRoster = finalRoster.filter(s => classSpellIndexes.has(s.index));
        }

        if (!cancelled) setMasterRoster(finalRoster);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Unable to fetch spells. Please try again.");
      }
    }

    fetchRoster();
    return () => { cancelled = true; };
  }, [levelFilter, schoolFilter, classFilter]);

  // 2. Filter the master list by Name
  const filteredMasterRoster = useMemo(() => {
    if (!search.trim()) return masterRoster;
    const q = search.trim().toLowerCase();
    return masterRoster.filter((spell) => spell.name.toLowerCase().includes(q));
  }, [masterRoster, search]);

  // 3. Debounced fetch for spell details
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (filteredMasterRoster.length === 0) {
        setDisplayedSpells([]);
        setLoading(false);
        return;
      }

      async function fetchSpellDetails() {
        setLoading(true);
        const chunkToFetch = filteredMasterRoster.slice(0, visibleCount);

        try {
          const detailPromises = chunkToFetch.map(async (spell) => {
            try {
              const detailRes = await fetch(`${API_BASE}${spell.url}`);
              if (!detailRes.ok) throw new Error("API Limit Reached");
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

          const enriched = await Promise.all(detailPromises);
          if (!cancelled) setDisplayedSpells(enriched);
        } catch (e) {
          console.error("Failed to scribe spell details:", e);
        } finally {
          if (!cancelled) setLoading(false);
        }
      }

      fetchSpellDetails();
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [filteredMasterRoster, visibleCount]);

  // 4. Static Dropdowns
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

  const schoolOptions = [
    { value: "all", label: "All Schools" },
    { value: "abjuration", label: "Abjuration" },
    { value: "conjuration", label: "Conjuration" },
    { value: "divination", label: "Divination" },
    { value: "enchantment", label: "Enchantment" },
    { value: "evocation", label: "Evocation" },
    { value: "illusion", label: "Illusion" },
    { value: "necromancy", label: "Necromancy" },
    { value: "transmutation", label: "Transmutation" }
  ];

  const classOptions = [
    { value: "all", label: "All Classes" },
    { value: "bard", label: "Bard" },
    { value: "cleric", label: "Cleric" },
    { value: "druid", label: "Druid" },
    { value: "paladin", label: "Paladin" },
    { value: "ranger", label: "Ranger" },
    { value: "sorcerer", label: "Sorcerer" },
    { value: "warlock", label: "Warlock" },
    { value: "wizard", label: "Wizard" }
  ];

  // 📍 THE FIX: Reset filters now smoothly scrolls you back to the top
  const resetFilters = () => {
    setSearch("");
    setLevelFilter("all");
    setSchoolFilter("all");
    setClassFilter("all");
    setVisibleCount(20);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    scrollPositionRef.current = window.scrollY;
    setVisibleCount((prev) => prev + 20);
  };

  // 📍 THE FIX: Consume the bookmark so it doesn't randomly trigger later
  useEffect(() => {
    if (scrollPositionRef.current > 0 && !loading) {
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: "instant",
      });
      scrollPositionRef.current = 0; 
    }
  }, [displayedSpells, loading]);

  return (
    <div className="page-browse">
      <aside className="sidebar-filters" aria-label="Spell filters">
        <h2 className="page-title">Spell Index</h2>

        <label className="field">
          <span className="field-label">Search</span>
          <input
            type="text"
            className="input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(20);
              window.scrollTo(0, 0); // 📍 Snap to top
            }}
            placeholder="Search by name..."
          />
        </label>

        <label className="field">
          <span className="field-label">Level</span>
          <select 
            className="input input-select" 
            value={levelFilter} 
            onChange={(e) => { 
              setLevelFilter(e.target.value); 
              setVisibleCount(20); 
              window.scrollTo(0, 0); // 📍 Snap to top
            }}
          >
            {levelOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>

        <label className="field">
          <span className="field-label">School</span>
          <select 
            className="input input-select" 
            value={schoolFilter} 
            onChange={(e) => { 
              setSchoolFilter(e.target.value); 
              setVisibleCount(20); 
              window.scrollTo(0, 0); // 📍 Snap to top
            }}
          >
            {schoolOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Class</span>
          <select 
            className="input input-select" 
            value={classFilter} 
            onChange={(e) => { 
              setClassFilter(e.target.value); 
              setVisibleCount(20); 
              window.scrollTo(0, 0); // 📍 Snap to top
            }}
          >
            {classOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>
      </aside>

      <section className="spell-grid-section">
        {loading && displayedSpells.length === 0 && (
          <p className="status status-loading">Consulting the Weave...</p>
        )}

        {!loading && error && <p className="status status-error">{error}</p>}

        {!error && (displayedSpells.length > 0 || search || levelFilter !== "all" || schoolFilter !== "all" || classFilter !== "all") && (
          <>
            {displayedSpells.length === 0 && !loading ? (
              <div className="empty-state-container">
                <p className="empty-state-text">
                  The Weave reveals a magical void. No spell matches these parameters in our current mortal world.
                </p>
                <button className="btn btn-ghost" onClick={resetFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <p className="field-label" style={{ marginBottom: "1rem" }}>
                  Showing {displayedSpells.length} of {filteredMasterRoster.length} spells
                </p>
                <div className="spell-grid" role="list" aria-label="Spell search results">
                  {displayedSpells.map((spell) => {
                    const isPrepared = preparedSpells.some((s) => s.index === spell.index);
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

                {visibleCount < filteredMasterRoster.length && (
                  <div className="load-more-container">
                    <button className="btn btn-load-more" onClick={handleLoadMore} disabled={loading}>
                      {loading ? "Scribing more spells..." : "Load More Spells"}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default BrowsePage;
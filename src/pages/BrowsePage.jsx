import { useEffect, useMemo, useState } from "react";
import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";
import SpellCard from "../components/SpellCard.jsx";
import "./BrowsePage.css";

const API_BASE = "https://www.dnd5eapi.co";

// Responsible for fetching and enriching spells from the 5e API.
function BrowsePage() {
  // --- CORE DATA ---
  // Lightweight list of spell names and URLs from the API
  const [masterRoster, setMasterRoster] = useState([]);
  // Spell data actively rendered on the screen
  const [displayedSpells, setDisplayedSpells] = useState([]);
  // Pagination tracker to "slice" the next chunk of spells
  const [visibleCount, setVisibleCount] = useState(20);

  // --- UI & FEEDBACK ---
  // Toggles the "Consulting the Weave..." loading message
  const [loading, setLoading] = useState(true);
  // Stores API failure messages for the user
  const [error, setError] = useState("");

  // --- FILTERING & SEARCH ---
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");

  // --- GLOBAL STATE ---
  // Custom hook to manage persistent spellbook additions
  const { preparedSpells, addSpell } = usePreparedSpells();

  // Fetch the lightweight master roster exactly once.
  useEffect(() => {
    let cancelled = false;

    // Fetches the basic spell index from the API, which contains minimal info.
    async function fetchRoster() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/spells`);
        if (!res.ok) throw new Error("Failed to fetch spell index");
        const data = await res.json();

        if (!cancelled) {
          setMasterRoster(data.results || []);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Unable to fetch spells. Please try again.");
      }
    }

    fetchRoster();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch full details only for the visible chunk of spells.
  useEffect(() => {
    // This flag helps prevent state updates if the component unmounts during fetch.
    let cancelled = false;

    // If the master roster hasn't loaded yet, there's nothing to fetch.
    if (masterRoster.length === 0) return;

    // Fetches detailed spell data for the currently visible chunk of spells.
    async function fetchSpellDetails() {
      setLoading(true);

      const chunkToFetch = masterRoster.slice(0, visibleCount);

      try {
        const detailPromises = chunkToFetch.map(async (spell) => {
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

        const enriched = await Promise.all(detailPromises);

        if (!cancelled) {
          setDisplayedSpells(enriched);
        }
      } catch (e) {
        console.error("Failed to fetch detailed data:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSpellDetails();
    return () => {
      cancelled = true;
    };
  }, [masterRoster, visibleCount]);

  // Applies search and filter criteria to the currently loaded spells.
  const filteredSpells = useMemo(() => {
    // Start with the spells that have been loaded so far.
    let list = displayedSpells;

    // Apply search filter if there's a query.
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((spell) => spell.name.toLowerCase().includes(q));
    }

    // Apply level filter if it's not set to "all".
    if (levelFilter !== "all") {
      const levelNum = Number(levelFilter);
      list = list.filter((spell) => spell.level === levelNum);
    }

    // Apply school filter if it's not set to "all".
    if (schoolFilter !== "all") {
      list = list.filter(
        (spell) => spell.school && spell.school.index === schoolFilter,
      );
    }

    // Apply class filter if it's not set to "all".
    if (classFilter !== "all") {
      list = list.filter((spell) =>
        spell.classes?.some((c) => c.index === classFilter),
      );
    }

    return list;
  }, [displayedSpells, search, levelFilter, schoolFilter, classFilter]);

  // Static options for spell levels with dynamic options.
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

  // Dynamically generates school options based on the currently displayed spells.
  const schoolOptions = useMemo(() => {
    // Use a Map to ensure uniqueness of schools.
    const unique = new Map();

    // Iterate over displayed spells and collect unique schools.
    displayedSpells.forEach((spell) => {
      if (spell.school) unique.set(spell.school.index, spell.school.name);
    });

    // Start with the "All Schools" option, then add the unique schools from the displayed spells.
    return [
      { value: "all", label: "All Schools" },
      ...Array.from(unique.entries()).map(([value, label]) => ({
        value,
        label,
      })),
    ];
  }, [displayedSpells]);

  const classOptions = useMemo(() => {
    // Use a Map to ensure uniqueness of classes.
    const unique = new Map();

    // Iterate over displayed spells and collect unique classes.
    displayedSpells.forEach((spell) => {
      (spell.classes || []).forEach((cls) => {
        unique.set(cls.index, cls.name);
      });
    });

    // Start with the "All Classes" option, then add the unique classes from the displayed spells.
    return [
      { value: "all", label: "All Classes" },
      ...Array.from(unique.entries()).map(([value, label]) => ({
        value,
        label,
      })),
    ];
  }, [displayedSpells]);

  // Resets all filters to their default state.
  const resetFilters = () => {
    setSearch("");
    setLevelFilter("all");
    setSchoolFilter("all");
    setClassFilter("all");
  };

  // Increases the visible count to load more spells when the "Load More" button is clicked.
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
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
        {!loading && error && <p className="status status-error">{error}</p>}

        {!loading && !error && (
          <>
            {filteredSpells.length === 0 ? (
              <div className="empty-state-container">
                <p className="empty-state-text">
                  The Weave reveals a magical void. No spell matches these
                  parameters in our current mortal world.
                </p>
                <button className="btn btn-ghost" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <p className="field-label" style={{ marginBottom: "1rem" }}>
                  Showing {filteredSpells.length} of {displayedSpells.length}{" "}
                  spells
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

                {/* Load More Button */}
                {!search &&
                  levelFilter === "all" &&
                  schoolFilter === "all" &&
                  classFilter === "all" &&
                  visibleCount < masterRoster.length && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "2rem",
                      }}
                    >
                      <button
                        className="btn"
                        onClick={handleLoadMore}
                        disabled={loading}
                      >
                        {loading
                          ? "Scribing more spells..."
                          : "Load More Spells"}
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
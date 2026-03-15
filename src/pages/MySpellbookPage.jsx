import { usePreparedSpells } from "../spellbook/usePreparedSpells.js";

function MySpellbookPage() {
  const { preparedSpells, removeSpell, clearSpells } = usePreparedSpells();

  return (
    <div>
      <h2>My Spellbook</h2>
      {preparedSpells.length === 0 ? (
        <p>No spells prepared yet.</p>
      ) : (
        <>
          <ul>
            {preparedSpells.map((spell) => (
              <li key={spell.index}>
                <strong>{spell.name}</strong> (Level {spell.level},{" "}
                {spell.school}){" "}
                <button type="button" onClick={() => removeSpell(spell.index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={clearSpells}>
            Clear All
          </button>
        </>
      )}
    </div>
  );
}

export default MySpellbookPage;

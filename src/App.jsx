// src/App.jsx
import "./App.css";

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Wandering Arcanum</h1>
        <p className="app-subtitle">A 5e Spell Browser & Spellbook</p>
      </header>

      <main className="app-main">
        <p>
          A polished React-based D&D 5e spell browser and management tool. It
          uses the public D&D 5e API as its only data source and presents
          everything in an immersive “arcane grimoire” UI.
        </p>
      </main>
    </div>
  );
}

export default App;

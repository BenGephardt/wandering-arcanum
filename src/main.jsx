import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './theme/ThemeProvider.jsx';
import { PreparedSpellsProvider } from './spellbook/PreparedSpellsProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PreparedSpellsProvider>
        <App />
      </PreparedSpellsProvider>
    </ThemeProvider>
  </StrictMode>
);
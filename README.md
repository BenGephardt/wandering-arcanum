# Wandering Arcanum ◆ A 5E Spellbook & Browser

![Wandering Arcanum Banner](https://via.placeholder.com/800x400?text=Wandering+Arcanum+Screenshot)
_(Note: Replace with a real screenshot or GIF of the app in action!)_

## Project Description

Wandering Arcanum is a modern, React-based 5th Edition spell browser and management tool. Designed for players and Dungeon Masters alike, this application allows users to effortlessly explore, filter, and 'prepare' spells, creating a personalized digital spellbook that persists across sessions.

It embraces a unique "Arcane Grimoire" design system, focusing on a "paper and ink" aesthetic with thematic typography, custom borders, and color-coded spell cards by school of magic, ensuring an immersive and accessible user experience.

## Modern Tech Stack

- **React 18:** Functional components utilizing Hooks and the Context API for global state.
- **Vite:** Next-generation frontend tooling for near-instant HMR (Hot Module Replacement).
- **React Router v6:** Declarative client-side routing.
- **D&D 5e API:** Dynamic data fetching from the [5e-SRD](https://www.dnd5eapi.co/).
- **Local Storage:** Persistence layer for the user's spellbook across sessions.
- **CSS3:** Custom properties (variables), Grid, and Flexbox for a responsive, themed UI.

## Features

- **Comprehensive Spell Browser:** Fetches and displays a vast array of D&D 5e spells from the [D&D 5e API](https://www.dnd5eapi.co).
- **Dynamic Filtering & Search:**
  - Live search bar for instant spell lookup.
  - Filter spells by Level (Cantrip–9th), School (Evocation, Necromancy, etc.), and Class.
- **Personalized Spellbook:**
  - "Prepare Spell" functionality to add spells to a global spellbook.
  - Spells persist across browser sessions using `localStorage`.
  - Dedicated "My Spellbook" view to manage prepared spells.
- **Detailed Spell Views:** Click on any spell card to access a dedicated page with in-depth information, including casting time, range, components, duration, and full description.
- **Immersive Design System ("Arcane Grimoire"):**
  - "Paper and Ink" aesthetic with subtle textures and thematic typography.
  - Spell cards feature unique double-borders and color-coding based on magic school.
- **Accessible & Themed:**
  - **WCAG 2.1 AA Compliance** for keyboard navigation, ARIA labels, and contrast.
  - **Three Theme Modes:** Light (Parchment), Dark (Deep Umber), and "Darkvision" (High-Contrast Grayscale) with seamless toggling.

## Installation & Setup

### Using GitHub Codespaces

1. Click the **Code** button on this repository.
2. Select the **Codespaces** tab.
3. Click **Create codespace on main**.
4. Once the environment loads, run the following in the terminal:
   ```bash
   npm install
   npm run dev
   ```

### Local Setup

If you prefer to run the project on your local machine:

1. Clone the Repository:
   ```Bash
   git clone https://github.com/BenGephardt/wandering-arcanum.git
   cd wandering-arcanum
   ```
2. Install Dependencies:
   ```Bash
   npm install
   ```
3. Start Development Server:
   ```Bash
   npm run dev
   ```
4. Build for Production:
   ```Bash
   npm run build
   ```

## Usage

- **Browse Spells:** Navigate to the `/` (Home) route to see all available spells.
- **Filter & Search:** Use the sidebar filters or the search bar to narrow down the list.
- **View Details:** Click on any spell card to view its full details.
- **Prepare Spells:** Use the “Prepare Spell” button on cards or detail pages to add spells to your personal spellbook.
- **My Spellbook:** Visit the `/my-spellbook` route to see and manage your prepared spells.
- **Change Theme:** Use the theme toggle (usually in the header/footer) to switch between Daylight (Light), Torchlight (Dark), and Darkvision (Grayscale) modes.

## Acknowledgements

- Data provided by the fantastic [D&D 5e API](https://www.dnd5eapi.co/).
- Developed with notes and guidance from [Codecademy](https://www.codecademy.com/) and [Launch School](https://launchschool.com).
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/en/main)
- [Google Fonts](https://fonts.google.com/)

## Legal Attribution

This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of the Coast LLC and available at [https://dnd.wizards.com/resources/systems-reference-document](https://dnd.wizards.com/resources/systems-reference-document). The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at [https://creativecommons.org/licenses/by/4.0/legalcode](https://creativecommons.org/licenses/by/4.0/legalcode).

## License

This project is distributed under the **GNU General Public License v3.0 (GPLv3)**. See `LICENSE` for more information.

---

**Contact:** BenGephardt - [https://github.com/BenGephardt](https://github.com/BenGephardt)

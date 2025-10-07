# Oddyssey

Oddyssey is a high-tempo “Odd One Out” quiz experience built with Ionic, Capacitor, and Vue 3.
Players race through a 60 seconds round, selecting the intentionally incorrect option from four answers while managing power cards, climbing difficulty tiers, and banking streaks.
Authenticated players can preserve runs, revisit results, and compete on theme-specific leaderboards.

---

## Table of Contents

1. [Features](#features)
2. [Gameplay Overview](#gameplay-overview)
3. [Power Cards](#power-cards)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Environment Configuration](#environment-configuration)
8. [Core Workflows](#core-workflows)
9. [Services & Data Sources](#services--data-sources)
10. [Theming & UX](#theming--ux)
11. [Testing & Quality](#testing--quality)
12. [Capacitor Notes](#capacitor-notes)
13. [Roadmap Ideas](#roadmap-ideas)

---

## Features

- **Fast-paced 60s rounds** with adaptive difficulty and no per-question timer.
- **Theme selection** (football, anime, science) plus placeholders for upcoming packs.
- **Genkit AI integration scaffold** with curated fallback question bank ensuring distinct prompts and option phrasing.
- **Penalty mechanics**: wrong answers subtract 3 seconds, skips subtract 1 second, keeping pressure high.
- **Four single-use power cards** per game for strategic control (swap, remove, double score, safeguard time).
- **Detailed results summary** listing every question, the actual odd option, and the player’s choice.
- **Local persistence & high scores** using browser storage, separated by theme and global boards.
- **Authentication shell** with Google Identity Services + guest alias mode; signed-in users retain histories.
- **Responsive dark interface** leveraging Ionic components with warm accent and clean, flat UI.

---

## Gameplay Overview

- Start on the **Home** screen, choose a theme, and launch a run.
- Questions escalate from *easy → medium → hard → expert* as you answer correctly.
- Selecting the **odd one out** yields 1 point (2 if a double-score card is active).
- Incorrect answers shave 3 seconds (unless Time Keep is active); skipping costs 1 second.
- The engine keeps serving distinct questions/options until the timer expires.
- When time’s up, a detailed **Results** view appears with replay options and a prompt to save (if the player is authenticated).

---

## Power Cards

Each card is available once per session:

| Card          | Effect                                                                 |
| ------------- | ---------------------------------------------------------------------- |
| **Swap Question** | Instantly fetches a fresh question, preserving time and streak momentum. |
| **Remove Correct** | Removes one safe option (never the odd one) to narrow the field.         |
| **Double Score** | Doubles the points for the current question if you nail the odd one.      |
| **Time Keep** | Shields the timer from the usual 3-second penalty on incorrect answers.     |

Active modifiers deactivate after the current question resolves.

---

## Tech Stack

- **Vue 3 + `<script setup>`** for composable UI logic.
- **Ionic Vue components** for mobile-first design across iOS/Android/Web.
- **Capacitor 7** integration scaffold for native builds.
- **Pinia 3** for state management (`src/store`).
- **Vite 5** tooling (development server + bundler).
- **TypeScript** across the codebase for safer APIs.
- **JWT Decode** for parsing Google identity credentials on the client.

---

## Project Structure

```
├─ public/                    # Static assets served as-is
├─ src/
│  ├─ components/             # Reusable Ionic components (HUD, cards, timers)
│  ├─ data/
│  │  ├─ themes.ts            # Theme metadata + placeholders
│  │  └─ questionBank.ts      # Curated question fallback data
│  ├─ services/
│  │  ├─ authService.ts       # Google Identity loading + sign-in/out helpers
│  │  ├─ genkitService.ts     # Prompt builder & hook for Genkit AI (currently mocked)
│  │  ├─ questionService.ts   # Question orchestration (AI + fallback) with uniqueness guards
│  │  └─ storageService.ts    # Local storage for game records & high score views
│  ├─ store/
│  │  ├─ gameStore.ts         # Session lifecycle, timers, scoring, power cards
│  │  └─ userStore.ts         # Auth status, persistence, guest alias support
│  ├─ types/                  # Shared TypeScript interfaces
│  ├─ views/                  # Route-level pages (Home, Game, Results, HighScores, Profile)
│  ├─ App.vue                 # Root Ionic shell + GIS prompt host
│  └─ main.ts                 # App bootstrap, router, Pinia hydration
├─ tests/                     # Cypress + Vitest scaffolding (empty by default)
├─ capacitor.config.ts        # Capacitor project metadata
├─ vite.config.ts             # Vite + legacy plugin configuration
└─ package.json               # Scripts and dependencies
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (Capacitor 7 and Vite 5 are tested against modern LTS releases).
- npm 9+ (bundled with recent Node versions).
- Optional: Ionic CLI (`npm install -g @ionic/cli`) for extra tooling, though not required.

### Install & Run

```bash
npm install
npm run dev    # Launches Vite dev server with hot reload (default at http://localhost:5173)
```

Open the served URL in a modern browser (Chrome, Edge, Safari, Firefox). Ionic automatically adapts the experience for mobile device viewports.

---

## Environment Configuration

Create a `.env` (or `.env.local`) in the project root to expose runtime secrets. The only required key today is the Google Web Client ID:

```
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```

- When omitted, the app gracefully falls back to guest mode; sign-in buttons remain but surface an inline warning.
- The Google Identity Services prompt anchor lives at `src/App.vue` (`#oddyssey-google-signin`), so popup UX is already configured.

For native builds you’ll also need to configure platform-specific credentials (iOS URL schemes, Android SHA fingerprints); these steps are outside the current scope but the Capacitor bridge is ready.

---

## Core Workflows

### Game Loop (`src/store/gameStore.ts`)

1. **startGame(themeId)** resets state, assigns a new session ID, and queues the timer.
2. **fetchNextQuestion** orchestrates AI (Genkit once available) or fallback questions while tracking uniqueness across the run.
3. **answer / skipQuestion** evaluate outcomes, apply modifiers, track score/time, and log history (`PlayedQuestion` records).
4. **usePowerCard** toggles modifiers or mutates the current question (swap/remove).
5. **finishGame** finalizes the session and halts the timer.

The store also maintains `activeModifiers`, `powerCards` inventory, and references the difficulty ramp helper.

### Results & Persistence (`src/views/ResultsPage.vue`)

- Upon mount, the page builds a `GameRecord` snapshot. If the player is authenticated, the record is persisted via `saveGameRecord`.
- The persistence layer returns flags indicating personal bests or theme highs; the UI displays Ion chips accordingly.
- Guest players receive a prompt encouraging sign-in (no storage occurs for guests).

### High Scores (`src/views/HighScoresPage.vue`)

- Uses Ionic segments to switch between “All Themes” and specific themes.
- Entries are fetched from local storage via `listHighScores`, sorted by score, with timestamps rendered using `toLocaleString`.

### Profile (`src/views/ProfilePage.vue`)

- Allows signing in/out with Google or setting a persistent guest alias.
- Displays the 10 most recent stored runs for authenticated players.

---

## Services & Data Sources

| Service / Data File | Purpose |
| ------------------- | ------- |
| `services/genkitService.ts` | Builds the exact prompt Genkit needs (including exclusion lists) and logs the outgoing request. Currently returns `null` so the fallback bank is used; plug in the actual API call when ready. |
| `services/questionService.ts` | Guards uniqueness, sanitizes AI results, and falls back to curated data if necessary. |
| `data/questionBank.ts` | Provides deterministic question sets per theme with odd option metadata for offline play/testing. |
| `services/storageService.ts` | Wraps `localStorage` for saving `GameRecord` snapshots and computing leaderboards. |
| `services/authService.ts` | Lazy-loads Google Identity, decodes JWT credentials, and exposes helper functions for sign-in/out. |

---

## Theming & UX

- Dark palette is centralized in `src/theme/variables.css` with a primary accent `#FF8C42`.
- Global font stack uses Inter/Segoe/sans fallbacks.
- Gradients and blurs create depth while staying lightweight for mobile GPUs.
- Ionic’s always-on dark palette is activated (`@ionic/vue/css/palettes/dark.always.css`).
- Components such as `GameHud`, `CountdownBar`, and `PowerCardsStrip` keep surfaces translucent with subtle highlights.

---

## Testing & Quality

| Command            | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Vite development server with HMR.                   |
| `npm run build`    | Type-check via `vue-tsc` then generate production build. |
| `npm run lint`     | ESLint (Vue + TypeScript rules).                    |
| `npm run test:unit`| Vitest scaffold (add specs under `tests/`).         |
| `npm run test:e2e` | Cypress end-to-end runner (configure as needed).    |

No automated tests are included yet; hooks exist for adding unit/component/E2E coverage.

---

## Capacitor Notes

- `capacitor.config.ts` is initialized with `appId: com.oddyssey.app` and `appName: oddyssey-app`.
- Run `npx cap add ios` / `npx cap add android` after configuring native SDK prerequisites.
- The Ionic CLI (`npx ionic capacitor run <platform>`) can streamline debugging once platforms are added.
- Remember to sync after every web build: `npx cap sync`.

---

## Roadmap Ideas

- Integrate real Genkit API responses (swap the mocked `Promise.resolve(null)`).
- Implement server-backed leaderboards and friend challenges.
- Add more theme packs and localized question variants.
- Track streaks/combo multipliers for extra scoring depth.
- Offer cooperative/versus multiplayer or weekly events.
- Enhance accessibility (reduce motion option, screen reader labels, haptics tuning).
- Ship native mobile binaries with custom splash/screens and offline caching.

Feel free to adapt these ideas to suit the product vision. Oddyssey’s modular architecture is designed to grow as the content library, player base, and platform coverage expand.


# Oddyssey

Oddyssey is a high-tempo "Odd One Out" quiz experience built with Ionic 8, Capacitor 7, and Vue 3.
Players race through a 60-second round, selecting the intentionally incorrect option from four answers while managing power cards, climbing difficulty tiers, and banking streaks.
Authenticated players can preserve runs, revisit results, and compete on theme-specific leaderboards.

---

## Table of Contents

1. [Features](#features)
2. [Gameplay Overview](#gameplay-overview)
3. [Power Cards](#power-cards)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Routes](#routes)
7. [Getting Started](#getting-started)
8. [Environment Configuration](#environment-configuration)
9. [Core Workflows](#core-workflows)
10. [Services & Data Sources](#services--data-sources)
11. [Theming & UX](#theming--ux)
12. [Testing & Quality](#testing--quality)
13. [Capacitor Notes](#capacitor-notes)
14. [Roadmap Ideas](#roadmap-ideas)

---

## Features

- **Fast-paced 60s rounds** with adaptive difficulty and no per-question timer.
- **Theme selection** — three core themes (World Football, Anime Universe, Science & Discovery) plus placeholders for upcoming packs (Space Explorers, Street Foods).
- **Genkit AI integration scaffold** with a curated fallback question bank ensuring distinct prompts and option phrasing.
- **Penalty mechanics**: wrong answers subtract 3 seconds, skips subtract 1 second, keeping pressure high.
- **Four single-use power cards** per game for strategic control (swap, remove, double score, safeguard time).
- **Detailed results summary** listing every question, the actual odd option, and the player's choice.
- **Local persistence & high scores** using browser storage, separated by theme and global boards.
- **Authentication shell** with Google Identity Services + guest alias mode; signed-in users retain histories.
- **Responsive dark interface** leveraging Ionic 8 components with a warm accent and clean, flat UI.
- **Lazy-loaded routes** for Game, Results, High Scores, and Profile pages to optimize initial load time.

---

## Gameplay Overview

- Start on the **Home** screen, choose a theme, and launch a run.
- Difficulty escalates automatically as you progress through questions: *easy* (questions 1–3) → *medium* (4–7) → *hard* (8–12) → *expert* (13+).
- Selecting the **odd one out** yields 1 point (2 if a Double Score card is active).
- Incorrect answers shave 3 seconds (unless Time Keep is active); skipping costs 1 second.
- The engine keeps serving distinct questions and options until the 60-second timer expires.
- When time's up, a detailed **Results** view appears with replay options and a prompt to save (if the player is authenticated).

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

- **Vue 3 + `<script setup>`** — Composition API with TypeScript generics for typed props and emits.
- **Ionic 8 (`@ionic/vue`)** — mobile-first component library for iOS/Android/Web.
- **Ionicons 7** — icon set used across theme pickers, difficulty badges, and navigation.
- **Capacitor 7** — integration scaffold for native iOS and Android builds.
- **Pinia 3** — state management for game sessions (`gameStore`) and authentication (`userStore`).
- **Vite 5** — development server, bundler, and legacy browser support via `@vitejs/plugin-legacy`.
- **Vue Router 4** — client-side routing powered by `@ionic/vue-router` with lazy-loaded views.
- **TypeScript 5.6** — strict typing across the entire codebase.
- **JWT Decode 4** — parsing Google Identity credentials on the client.

---

## Project Structure

```
├─ public/                    # Static assets served as-is (favicon.png)
├─ src/
│  ├─ components/             # Reusable Ionic components
│  │  ├─ CountdownBar.vue     # Visual timer progress bar with animated width
│  │  ├─ GameHud.vue          # Real-time HUD showing time, score, and question count
│  │  ├─ PowerCardsStrip.vue  # Row of four power card buttons with usage tracking
│  │  ├─ QuestionCard.vue     # Question prompt with four options and difficulty badge
│  │  └─ ThemePicker.vue      # Theme selection grid with upcoming previews
│  ├─ data/
│  │  ├─ themes.ts            # Theme metadata (3 core + 2 upcoming placeholders)
│  │  └─ questionBank.ts      # Curated fallback questions (~45 across 3 themes × 4 difficulties)
│  ├─ router/
│  │  └─ index.ts             # Route definitions with lazy-loaded views
│  ├─ services/
│  │  ├─ authService.ts       # Google Identity Services SDK loading + sign-in/out helpers
│  │  ├─ genkitService.ts     # Prompt builder & hook for Genkit AI (currently returns null)
│  │  ├─ questionService.ts   # Question orchestration (AI + fallback) with uniqueness guards
│  │  └─ storageService.ts    # localStorage wrapper for game records & high score views
│  ├─ store/
│  │  ├─ gameStore.ts         # Session lifecycle, timers, scoring, power cards, difficulty ramp
│  │  └─ userStore.ts         # Auth status, localStorage persistence, guest alias support
│  ├─ theme/
│  │  └─ variables.css        # Dark palette, Ionic overrides, accent color (#FF8C42)
│  ├─ types/
│  │  └─ game.ts              # Shared interfaces (GameQuestion, PlayedQuestion, PowerCardState, etc.)
│  ├─ utils/
│  │  └─ id.ts                # UUID generator with crypto.randomUUID() fallback
│  ├─ views/                  # Route-level pages
│  │  ├─ HomePage.vue         # Theme selection, power cards info, start button
│  │  ├─ GamePage.vue         # Main gameplay (HUD, question card, countdown, power cards)
│  │  ├─ ResultsPage.vue      # Post-game summary with question review and save prompt
│  │  ├─ HighScoresPage.vue   # Leaderboard with theme/global segment selector
│  │  └─ ProfilePage.vue      # Auth management, guest alias, recent run history
│  ├─ App.vue                 # Root Ionic shell + Google Sign-In prompt host
│  └─ main.ts                 # App bootstrap: IonicVue, Pinia, Router, user hydration
├─ tests/
│  ├─ unit/                   # Vitest unit test scaffold
│  └─ e2e/                    # Cypress E2E test scaffold with fixtures and support files
├─ capacitor.config.ts        # Capacitor project metadata (appId, appName, webDir)
├─ vite.config.ts             # Vite + Vue + legacy plugin configuration, @ path alias
└─ package.json               # Scripts, dependencies, and rollup override
```

---

## Routes

Routing is handled by `@ionic/vue-router` with `createWebHistory`. Four of five views are lazy-loaded.

| Path           | Name        | Component          | Notes                              |
| -------------- | ----------- | ------------------ | ---------------------------------- |
| `/`            | —           | —                  | Redirects to `/home`               |
| `/home`        | Home        | `HomePage.vue`     | Eagerly loaded                     |
| `/game`        | Game        | `GamePage.vue`     | Lazy-loaded; receives `?theme=<id>` query param |
| `/results`     | Results     | `ResultsPage.vue`  | Lazy-loaded                        |
| `/highscores`  | HighScores  | `HighScoresPage.vue` | Lazy-loaded                      |
| `/profile`     | Profile     | `ProfilePage.vue`  | Lazy-loaded                        |

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

For native builds you'll also need to configure platform-specific credentials (iOS URL schemes, Android SHA fingerprints); these steps are outside the current scope but the Capacitor bridge is ready.

---

## Core Workflows

### Game Loop (`src/store/gameStore.ts`)

1. **startGame(themeId)** resets state, assigns a new session ID via `randomUUID()`, and starts the 1-second interval timer.
2. **fetchNextQuestion** derives the difficulty from the total number of questions answered so far and orchestrates AI (Genkit once available) or fallback questions while tracking uniqueness via `seenQuestionIds` and `seenOptionTexts`.
3. **answer / skipQuestion** evaluate outcomes, apply active modifiers, adjust score/time, log history as `PlayedQuestion` records, and automatically fetch the next question.
4. **usePowerCard** decrements the card's remaining count, then either swaps the question, removes a safe option, or activates a modifier flag (`doubleScore` / `timeKeep`).
5. **finishGame** sets status to `'finished'`, records `finishedAt`, and halts the timer.

The store also maintains `activeModifiers`, `powerCards` inventory, and `currentQuestionCardsUsed` to track per-question card usage in the results.

### Results & Persistence (`src/views/ResultsPage.vue`)

- Upon mount, the page builds a `GameRecord` snapshot. If the player is authenticated, the record is persisted via `saveGameRecord`.
- The persistence layer returns flags indicating personal bests or theme highs; the UI displays Ion chips accordingly.
- Guest players receive a prompt encouraging sign-in (no storage occurs for guests).

### High Scores (`src/views/HighScoresPage.vue`)

- Uses Ionic segments to switch between "All Themes" and specific themes.
- Entries are fetched from local storage via `listHighScores`, sorted by score, with timestamps rendered using `toLocaleString`.

### Profile (`src/views/ProfilePage.vue`)

- Allows signing in/out with Google or setting a persistent guest alias.
- Displays the 10 most recent stored runs for authenticated players.

---

## Services & Data Sources

| Service / Data File | Purpose |
| ------------------- | ------- |
| `services/genkitService.ts` | Builds the exact prompt Genkit needs (including exclusion lists for seen questions/options) and logs the outgoing request. Currently returns `null` so the fallback bank is used; plug in the actual API call when ready. |
| `services/questionService.ts` | Guards question and option-text uniqueness, sanitizes AI results, and falls back to curated data when the AI service returns `null`. |
| `data/questionBank.ts` | Provides deterministic question sets per theme (~45 curated questions across 3 themes and 4 difficulty levels) with odd option metadata for offline play and testing. Exports `getFallbackQuestion()`. |
| `data/themes.ts` | Defines 3 core themes (World Football, Anime Universe, Science & Discovery) with accent colors and difficulty ramp arrays, plus 2 upcoming placeholders. |
| `services/storageService.ts` | Wraps `localStorage` for saving `GameRecord` snapshots and computing leaderboards. Returns personal-best and theme-best flags on save. |
| `services/authService.ts` | Lazy-loads the Google Identity Services SDK, decodes JWT credentials via `jwt-decode`, and exposes `signInWithGoogle()`, `signOutFromGoogle()`, and `isGoogleConfigured()` helpers. |

---

## Theming & UX

- Dark palette is centralized in `src/theme/variables.css` with a primary accent `#FF8C42` (warm orange).
- Global font stack uses Inter / Segoe UI / system-ui fallbacks.
- Glassmorphism effects (backdrop blur, translucent surfaces) create depth while staying lightweight for mobile GPUs.
- Ionic's always-on dark palette is activated (`@ionic/vue/css/palettes/dark.always.css`).
- Buttons use gradient fills (orange-to-red) with rounded corners; outline variants feature transparent backgrounds with accent borders.
- Components such as `GameHud`, `CountdownBar`, and `PowerCardsStrip` keep surfaces translucent with subtle highlights.

---

## Testing & Quality

| Command            | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Vite development server with HMR.                   |
| `npm run build`    | Type-check via `vue-tsc` then generate production build. |
| `npm run preview`  | Preview the production build locally.               |
| `npm run lint`     | ESLint (Vue + TypeScript rules).                    |
| `npm run test:unit`| Vitest scaffold (add specs under `tests/unit/`).    |
| `npm run test:e2e` | Cypress end-to-end runner (configure as needed).    |

Test scaffolding is in place under `tests/` with example specs for both Vitest and Cypress; add real coverage as the codebase matures.

---

## Capacitor Notes

- `capacitor.config.ts` is initialized with `appId: com.oddyssey.app`, `appName: oddyssey-app`, and `webDir: dist`.
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
- Ship native mobile binaries with custom splash screens and offline caching.

Feel free to adapt these ideas to suit the product vision. Oddyssey's modular architecture is designed to grow as the content library, player base, and platform coverage expand.

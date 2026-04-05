# Oddyssey

Oddyssey is a high-tempo "Odd One Out" quiz experience built with Ionic 8, Capacitor 7, and Vue 3.
Players race through a 60-second round, selecting the intentionally incorrect option from four answers while managing power cards, climbing difficulty tiers, and banking streaks.
Authenticated players can preserve runs, revisit results, and compete on server-backed leaderboards.

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
13. [Deployment](#deployment)
14. [Capacitor Notes](#capacitor-notes)
15. [PWA & Offline Support](#pwa--offline-support)
16. [Roadmap](#roadmap)

---

## Features

- **Fast-paced 60s rounds** with adaptive difficulty and no per-question timer.
- **Seven theme packs** — World Football, Anime Universe, Science & Discovery, Space Explorers, Street Foods, World History, and Pop Music.
- **Genkit AI integration** with a deployed flow endpoint for dynamic question generation, plus a curated fallback question bank ensuring distinct prompts and option phrasing. Includes a 10-second timeout, automatic retry, response validation, and graceful fallback.
- **Penalty mechanics**: wrong answers subtract 3 seconds, skips subtract 1 second, keeping pressure high.
- **Four single-use power cards** per game for strategic control (swap, remove, double score, safeguard time).
- **Streak/combo multiplier system** rewarding consecutive correct answers with escalating score multipliers (×1 → ×5).
- **Detailed results summary** listing every question, the actual odd option, player's choice, and streak at each answer.
- **Server-backed leaderboards** via Firebase Firestore with local storage fallback for offline play.
- **Social features** — friend system with search, requests, and management; friend challenges with 24-hour expiry and real-time score tracking.
- **Versus & cooperative multiplayer** with real-time matchmaking, live opponent state broadcasting, and lobby/ready system.
- **Weekly events** with rotating themes, standings, and scheduled Cloud Functions for event creation.
- **Internationalization** — full UI translations and locale-specific question banks for English, Vietnamese, and Japanese.
- **Accessibility** — reduce-motion support, screen reader announcements via aria-live regions, configurable haptic feedback, and ARIA labels on all interactive components.
- **Authentication** with Google Identity Services + Firebase Auth bridge + guest alias mode; signed-in users retain histories.
- **Responsive dark interface** leveraging Ionic 8 components with a warm accent and clean, flat UI.
- **PWA & offline support** — service worker with Workbox caching, IndexedDB offline data layer, installable manifest.
- **Native mobile ready** — Capacitor plugins for splash screen, status bar, keyboard, screen orientation, and haptics.
- **Lazy-loaded routes** for all pages except Home to optimize initial load time.

---

## Gameplay Overview

- Start on the **Home** screen, choose a theme, and launch a run.
- Difficulty escalates automatically as you progress through questions: *easy* (questions 1–3) → *medium* (4–7) → *hard* (8–12) → *expert* (13+).
- Selecting the **odd one out** yields base points (1, or 2 if a Double Score card is active) multiplied by a combo multiplier that scales with your consecutive correct answer streak (×1 at 0–2, ×2 at 3–4, ×3 at 5–6, ×4 at 7–9, ×5 at 10+).
- Incorrect answers shave 3 seconds (unless Time Keep is active) and reset your streak; skipping costs 1 second and resets your streak.
- The engine keeps serving distinct questions and options until the 60-second timer expires.
- When time's up, a detailed **Results** view appears with replay options, streak statistics, and a prompt to save (if the player is authenticated).
- Players can also compete in **versus or cooperative multiplayer** matches, participate in **weekly events**, or send **friend challenges**.

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
- **Capacitor 7** — native iOS and Android builds with plugins for splash screen, status bar, keyboard, screen orientation, and haptics.
- **Pinia 3** — state management for game sessions (`gameStore`), authentication (`userStore`), multiplayer (`multiplayerStore`), events (`eventStore`), and notifications (`notificationStore`).
- **Firebase 12** — optional backend for authentication (bridged from Google Sign-In), Firestore (leaderboards, friends, challenges, matches, events), and Cloud Functions (matchmaking, weekly event creation, stale cleanup).
- **Vite 5** — development server, bundler, and legacy browser support via `@vitejs/plugin-legacy`.
- **Vue Router 4** — client-side routing powered by `@ionic/vue-router` with lazy-loaded views.
- **vue-i18n 9** — Composition API mode internationalization with English, Vietnamese, and Japanese locale files.
- **TypeScript 5.6** — strict typing across the entire codebase.
- **idb 8** — IndexedDB wrapper for offline question caching, game record mirroring, and user preference storage.
- **vite-plugin-pwa** — Workbox-powered service worker for offline-first PWA capabilities.
- **JWT Decode 4** — parsing Google Identity credentials on the client.

---

## Project Structure

```
├─ public/                    # Static assets served as-is (favicon.png, PWA manifest, icons)
├─ src/
│  ├─ components/             # Reusable Ionic components
│  │  ├─ CoopHud.vue          # Cooperative multiplayer HUD showing teammate stats
│  │  ├─ CountdownBar.vue     # Visual timer progress bar with animated width
│  │  ├─ EventBanner.vue      # Promotional banner for active weekly events
│  │  ├─ EventCard.vue        # Card component for event listings
│  │  ├─ EventCountdown.vue   # Countdown timer for upcoming events
│  │  ├─ EventLeaderboard.vue # Standings table for event participants
│  │  ├─ GameHud.vue          # Real-time HUD showing time, score, streak, and question count
│  │  ├─ MatchResultModal.vue # Modal displaying multiplayer match outcomes
│  │  ├─ OpponentHud.vue      # Live opponent status during versus matches
│  │  ├─ PowerCardsStrip.vue  # Row of four power card buttons with usage tracking
│  │  ├─ QuestionCard.vue     # Question prompt with four options and difficulty badge
│  │  ├─ ScreenReaderAnnouncer.vue # Aria-live region for screen reader announcements
│  │  ├─ ThemePicker.vue      # Theme selection grid
│  │  └─ VersusLobby.vue      # Multiplayer lobby with ready system
│  ├─ composables/            # Vue Composition API composables
│  │  ├─ useAnnouncer.ts      # Screen reader announcement helper (polite/assertive)
│  │  ├─ useHaptics.ts        # Capacitor haptic feedback with enable/disable toggle
│  │  ├─ useOfflineStatus.ts  # Reactive online/offline status detection
│  │  └─ useReducedMotion.ts  # Reduced motion preference (OS + user override)
│  ├─ data/
│  │  ├─ themes.ts            # Theme metadata (7 themes with accent colors and difficulty ramps)
│  │  ├─ questionBank.ts      # Curated fallback questions (English)
│  │  ├─ questionBank.vi.ts   # Curated fallback questions (Vietnamese)
│  │  └─ questionBank.ja.ts   # Curated fallback questions (Japanese)
│  ├─ i18n/
│  │  ├─ index.ts             # vue-i18n plugin setup with locale detection and persistence
│  │  └─ locales/             # Translation files (en.json, vi.json, ja.json)
│  ├─ router/
│  │  └─ index.ts             # Route definitions with lazy-loaded views
│  ├─ services/
│  │  ├─ authService.ts       # Google Identity Services SDK loading + sign-in/out helpers
│  │  ├─ challengeService.ts  # Friend challenge creation, acceptance, scoring, and real-time subscriptions
│  │  ├─ eventService.ts      # Weekly event lifecycle, standings, and real-time subscriptions
│  │  ├─ firebaseService.ts   # Optional Firebase initialization with graceful degradation
│  │  ├─ friendService.ts     # Friend requests, search, and relationship management
│  │  ├─ genkitService.ts     # Prompt builder, Genkit flow API caller, response validation, retry, and fallback
│  │  ├─ leaderboardService.ts# Server-backed leaderboards via Firestore with local storage fallback
│  │  ├─ matchService.ts      # Real-time versus/cooperative match management with Firestore listeners
│  │  ├─ offlineDatabase.ts   # IndexedDB wrapper (questions cache, game records mirror, user preferences)
│  │  ├─ questionService.ts   # Question orchestration (AI + fallback) with uniqueness guards
│  │  └─ storageService.ts    # localStorage wrapper for game records & high score views
│  ├─ store/
│  │  ├─ eventStore.ts        # Weekly event state and subscriptions
│  │  ├─ gameStore.ts         # Session lifecycle, timers, scoring, power cards, streaks, difficulty ramp
│  │  ├─ multiplayerStore.ts  # Matchmaking, match state, opponent tracking, and result computation
│  │  ├─ notificationStore.ts # Real-time notification subscriptions for challenges, friends, and events
│  │  └─ userStore.ts         # Auth status, Firebase Auth bridge, localStorage persistence, guest alias
│  ├─ theme/
│  │  ├─ accessibility.css    # Reduced motion overrides, screen reader utility classes
│  │  └─ variables.css        # Dark palette, Ionic overrides, accent color (#FF8C42)
│  ├─ types/
│  │  └─ game.ts              # Shared interfaces (GameQuestion, PlayedQuestion, PowerCardState, etc.)
│  ├─ utils/
│  │  ├─ id.ts                # UUID generator with crypto.randomUUID() fallback
│  │  └─ streak.ts            # Combo multiplier tiers (×1–×5) based on streak count
│  ├─ views/                  # Route-level pages
│  │  ├─ ChallengesPage.vue   # Incoming, active, and completed friend challenges
│  │  ├─ EventDetailPage.vue  # Event info, countdown, standings, and join action
│  │  ├─ EventsPage.vue       # Active, upcoming, and completed weekly events
│  │  ├─ FriendsPage.vue      # Friend search, requests, list, and challenge initiation
│  │  ├─ GamePage.vue         # Main gameplay (HUD, question card, countdown, power cards, multiplayer overlays)
│  │  ├─ HighScoresPage.vue   # Leaderboard with theme/global segment selector
│  │  ├─ HomePage.vue         # Theme selection, power cards info, start button, event banners
│  │  ├─ MatchmakingPage.vue  # Multiplayer mode selection, search, lobby, and ready system
│  │  ├─ ProfilePage.vue      # Auth management, guest alias, recent runs, accessibility settings, locale picker
│  │  └─ ResultsPage.vue      # Post-game summary with question review, streak stats, and save prompt
│  ├─ App.vue                 # Root Ionic shell + Google Sign-In prompt host
│  └─ main.ts                 # App bootstrap: IonicVue, Pinia, Router, i18n, service worker, user hydration
├─ functions/
│  └─ src/
│     └─ index.ts             # Cloud Functions: matchmaking, weekly event creation, stale match/challenge cleanup
├─ tests/
│  ├─ unit/                   # Vitest unit test scaffold
│  └─ e2e/                    # Cypress E2E test scaffold with fixtures and support files
├─ capacitor.config.ts        # Capacitor project metadata (appId, appName, webDir, plugin configs)
├─ firestore.rules            # Firestore security rules
├─ vite.config.ts             # Vite + Vue + legacy + PWA plugin configuration, @ path alias
└─ package.json               # Scripts, dependencies, and rollup override
```

---

## Routes

Routing is handled by `@ionic/vue-router` with `createWebHistory`. All views except Home are lazy-loaded.

| Path              | Name         | Component            | Notes                                              |
| ----------------- | ------------ | -------------------- | -------------------------------------------------- |
| `/`               | —            | —                    | Redirects to `/home`                               |
| `/home`           | Home         | `HomePage.vue`       | Eagerly loaded                                     |
| `/game`           | Game         | `GamePage.vue`       | Lazy-loaded; receives `?theme=<id>`, optional `?challengeId`, `?eventId`, `?matchId` query params |
| `/results`        | Results      | `ResultsPage.vue`    | Lazy-loaded                                        |
| `/highscores`     | HighScores   | `HighScoresPage.vue` | Lazy-loaded                                        |
| `/profile`        | Profile      | `ProfilePage.vue`    | Lazy-loaded                                        |
| `/friends`        | Friends      | `FriendsPage.vue`    | Lazy-loaded; friend search, requests, and management |
| `/challenges`     | Challenges   | `ChallengesPage.vue` | Lazy-loaded; incoming, active, and completed challenges |
| `/events`         | Events       | `EventsPage.vue`     | Lazy-loaded; active, upcoming, and completed weekly events |
| `/events/:eventId`| EventDetail  | `EventDetailPage.vue`| Lazy-loaded; event details, standings, and join action |
| `/matchmaking`    | Matchmaking  | `MatchmakingPage.vue`| Lazy-loaded; multiplayer mode selection, search, and lobby |

---

## Getting Started

### Prerequisites

- Node.js 18+ (Capacitor 7 and Vite 5 are tested against modern LTS releases).
- npm 9+ (bundled with recent Node versions).
- Optional: Ionic CLI (`npm install -g @ionic/cli`) for extra tooling, though not required.
- Optional: Firebase CLI (`npm install -g firebase-tools`) for local emulators and manual deploys.

### Install & Run

```bash
npm install
npm run dev    # Launches Vite dev server with hot reload (default at http://localhost:5173)
```

Open the served URL in a modern browser (Chrome, Edge, Safari, Firefox). Ionic automatically adapts the experience for mobile device viewports.

### Firebase Local Emulators (optional)

If you have the Firebase CLI installed and a Firebase project configured:

```bash
firebase emulators:start    # Start Firestore, Functions, and Auth emulators
```

---

## Environment Configuration

Create a `.env` (or `.env.local`) in the project root to expose runtime secrets. See `.env.example` for the full list.

```
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
VITE_GENKIT_API_URL=<your-genkit-flow-endpoint-url>
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-project.firebaseapp.com>
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-project.appspot.com>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
VITE_FIREBASE_APP_ID=<your-firebase-app-id>
```

### Google Sign-In (`VITE_GOOGLE_CLIENT_ID`)

- When omitted, the app gracefully falls back to guest mode; sign-in buttons remain but surface an inline warning.
- The Google Identity Services prompt anchor lives at `src/App.vue` (`#oddyssey-google-signin`), so popup UX is already configured.

### Genkit AI Questions (`VITE_GENKIT_API_URL`)

- Point this to a deployed Genkit flow endpoint (e.g., on Cloud Functions for Firebase or Cloud Run) that accepts a JSON body `{ "data": { "prompt": "..." } }` and returns a JSON response with `{ "result": "{ \"prompt\": \"...\", \"options\": [...] }" }`.
- When omitted, the app uses the curated fallback question bank.
- When configured, the service sends the AI prompt with theme context, difficulty, locale, and exclusion lists, then validates the response before presenting it as a game question.
- If the Genkit endpoint is unreachable, times out (10 s), or returns invalid data, the app automatically falls back to the curated question bank — no gameplay interruption.

### Firebase (`VITE_FIREBASE_*`)

- When all Firebase variables are provided, the app enables server-backed leaderboards, friend system, challenges, multiplayer matchmaking, and weekly events via Firestore.
- When omitted, the app uses local-only localStorage leaderboards and social features are unavailable.
- Firebase Auth bridges the Google Sign-In credential to Firebase for Firestore access control.

For native builds you'll also need to configure platform-specific credentials (iOS URL schemes, Android SHA fingerprints); these steps are outside the current scope but the Capacitor bridge is ready.

---

## Core Workflows

### Game Loop (`src/store/gameStore.ts`)

1. **startGame(themeId, challengeId?, eventId?, matchId?)** resets state, assigns a new session ID via `randomUUID()`, and starts the 1-second interval timer. Optional parameters link the session to a challenge, event, or multiplayer match.
2. **fetchNextQuestion** derives the difficulty from the total number of questions answered so far and orchestrates AI (Genkit) or locale-specific fallback questions while tracking uniqueness via `seenQuestionIds` and `seenOptionTexts`.
3. **answer / skipQuestion** evaluate outcomes, apply active modifiers and the combo multiplier, adjust score/time, update streak tracking, log history as `PlayedQuestion` records, and automatically fetch the next question.
4. **usePowerCard** decrements the card's remaining count, then either swaps the question, removes a safe option, or activates a modifier flag (`doubleScore` / `timeKeep`).
5. **finishGame** sets status to `'finished'`, records `finishedAt`, and halts the timer.

The store also maintains `activeModifiers`, `powerCards` inventory, `currentQuestionCardsUsed`, `currentStreak`, `longestStreak`, and a `comboMultiplier` getter to track per-question card usage, streak momentum, and scoring depth.

### Results & Persistence (`src/views/ResultsPage.vue`)

- Upon mount, the page builds a `GameRecord` snapshot. If the player is authenticated, the record is persisted via `saveGameRecord` and optionally submitted to the server leaderboard.
- The persistence layer returns flags indicating personal bests or theme highs; the UI displays Ion chips accordingly.
- Displays longest streak and best combo multiplier achieved during the session.
- Guest players receive a prompt encouraging sign-in (no storage occurs for guests).

### High Scores (`src/views/HighScoresPage.vue`)

- Uses Ionic segments to switch between "All Themes" and specific themes.
- Entries are fetched from Firestore-backed leaderboards when available, falling back to local storage. Sorted by score, with timestamps rendered using `toLocaleString`.

### Profile (`src/views/ProfilePage.vue`)

- Allows signing in/out with Google or setting a persistent guest alias.
- Displays the 10 most recent stored runs for authenticated players.
- Accessibility settings: reduced motion toggle, haptic feedback toggle.
- Locale picker for switching between English, Vietnamese, and Japanese.

### Multiplayer (`src/store/multiplayerStore.ts`, `src/views/MatchmakingPage.vue`)

- Players select versus or cooperative mode and a theme, then enter a matchmaking queue.
- Cloud Functions automatically pair compatible players and create a match document.
- Both players enter a lobby, mark ready, and start playing simultaneously.
- Live game state (score, streak, question count) is broadcast to the opponent via Firestore listeners.
- At game end, final scores are submitted and the winner (or team score) is determined.

### Weekly Events (`src/store/eventStore.ts`, `src/views/EventsPage.vue`)

- A scheduled Cloud Function creates a new weekly event every Monday with a rotating theme.
- Players join events, play rounds that count toward standings, and compete on event-specific leaderboards.
- Real-time subscriptions keep standings and event status up to date.

### Friends & Challenges (`src/views/FriendsPage.vue`, `src/views/ChallengesPage.vue`)

- Players search for and add friends via Firestore-backed friend requests.
- Friends can send themed challenges with a 24-hour expiry window.
- Both players' scores are tracked, and a winner is determined when both complete the challenge.

---

## Services & Data Sources

| Service / Data File | Purpose |
| ------------------- | ------- |
| `services/genkitService.ts` | Builds the exact prompt Genkit needs (including exclusion lists for seen questions/options and locale context), calls the deployed Genkit flow endpoint via `fetch()`, validates and parses the AI response, and converts it into a `GameQuestion`. Includes a 10-second timeout, one automatic retry on transient failures, and graceful fallback when the API URL is not configured or the endpoint is unreachable. |
| `services/questionService.ts` | Guards question and option-text uniqueness, sanitizes AI results, and falls back to locale-specific curated data when the AI service returns `null`. |
| `data/questionBank.ts` | Curated fallback questions in English across 7 themes and 4 difficulty levels with odd option metadata for offline play and testing. Exports `getFallbackQuestion()`. |
| `data/questionBank.vi.ts` | Vietnamese locale question bank mirroring the English structure. |
| `data/questionBank.ja.ts` | Japanese locale question bank mirroring the English structure. |
| `data/themes.ts` | Defines 7 themes (World Football, Anime Universe, Science & Discovery, Space Explorers, Street Foods, World History, Pop Music) with accent colors and difficulty ramp arrays. |
| `services/storageService.ts` | Wraps `localStorage` for saving `GameRecord` snapshots and computing local leaderboards. Returns personal-best and theme-best flags on save. |
| `services/authService.ts` | Lazy-loads the Google Identity Services SDK, decodes JWT credentials via `jwt-decode`, and exposes `signInWithGoogle()`, `signOutFromGoogle()`, and `isGoogleConfigured()` helpers. |
| `services/firebaseService.ts` | Initializes Firebase app and services (Auth, Firestore) from `VITE_FIREBASE_*` env vars with graceful degradation when not configured. |
| `services/leaderboardService.ts` | Server-backed leaderboards via Firestore: submit scores, fetch global/theme/friends rankings, compute user rank, and sync offline records. Falls back to local storage when Firebase is unavailable. |
| `services/friendService.ts` | Friend system via Firestore: user profile management, search, friend requests (send/accept/decline), friend list retrieval, and relationship removal. |
| `services/challengeService.ts` | Friend challenges via Firestore: create challenges with 24-hour expiry, accept/decline, submit scores, determine winners, and real-time subscriptions. |
| `services/matchService.ts` | Real-time multiplayer via Firestore: matchmaking queue, match creation, player ready system, live game state broadcasting, and final score submission for versus and cooperative modes. |
| `services/eventService.ts` | Weekly events via Firestore: fetch active/upcoming/completed events, join events, submit scores, retrieve standings, and real-time subscriptions for event updates and leaderboards. |
| `services/offlineDatabase.ts` | IndexedDB wrapper (via `idb`) with three object stores: cached AI questions by theme+locale, mirrored game records, and user preferences. All operations are async with console.warn fallback. |

---

## Theming & UX

- Dark palette is centralized in `src/theme/variables.css` with a primary accent `#FF8C42` (warm orange).
- Global font stack uses Inter / Segoe UI / system-ui fallbacks.
- Glassmorphism effects (backdrop blur, translucent surfaces) create depth while staying lightweight for mobile GPUs.
- Ionic's always-on dark palette is activated (`@ionic/vue/css/palettes/dark.always.css`).
- Buttons use gradient fills (orange-to-red) with rounded corners; outline variants feature transparent backgrounds with accent borders.
- Components such as `GameHud`, `CountdownBar`, and `PowerCardsStrip` keep surfaces translucent with subtle highlights.
- Accessibility CSS (`src/theme/accessibility.css`) provides reduced motion overrides (respects `prefers-reduced-motion` and user toggle) and `.sr-only` utility class for screen reader content.
- `ScreenReaderAnnouncer` component provides `aria-live` regions (polite and assertive) for dynamic game state announcements.
- Haptic feedback integrates with Capacitor's Haptics plugin, offering light/medium/heavy taps, success/warning/error vibrations, and selection feedback — all toggleable by the user.

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

## Deployment

Oddyssey uses **Firebase** for web hosting and cloud functions, **Capacitor** for Android builds, and **GitHub Actions** for CI/CD.

### Firebase Setup

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com/).
2. **Enable required services**: Hosting, Cloud Functions, Firestore, and Authentication (Google provider).
3. **Update `.firebaserc`** — replace `oddyssey-app` with your Firebase project ID:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```
4. **Generate a service account key** for CI/CD:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Add the JSON content as a GitHub repository secret named `FIREBASE_SERVICE_ACCOUNT`
   - Add your project ID as a GitHub repository variable named `FIREBASE_PROJECT_ID`

### Manual Deployment

```bash
# Deploy web app to Firebase Hosting
npm run build && firebase deploy --only hosting

# Deploy Cloud Functions
cd functions && npm run build && firebase deploy --only functions

# Deploy everything (hosting + functions + firestore rules)
npm run build && firebase deploy

# Build Android debug APK (requires Android SDK + JDK 17)
npm run cap:android:build-debug
# APK output: android/app/build/outputs/apk/debug/app-debug.apk
```

### CI/CD Pipeline (GitHub Actions)

Three workflows automate the entire deployment lifecycle:

| Workflow | Trigger | What it does |
|----------|---------|-------------|
| **CI** (`.github/workflows/ci.yml`) | Pull request to `main` | Lint → type-check → unit test → build → deploy preview to Firebase Hosting. Comments a preview URL on the PR. |
| **Deploy** (`.github/workflows/deploy.yml`) | Push to `main` | Deploys web app to Firebase Hosting (live) and Cloud Functions to production. |
| **Android Build** (`.github/workflows/android-build.yml`) | Push to `main` + manual trigger | Builds a debug APK via Capacitor + Gradle. Uploads the APK as a downloadable GitHub Actions artifact. |

#### Required Secrets & Variables

| Name | Type | Purpose |
|------|------|---------|
| `FIREBASE_SERVICE_ACCOUNT` | Secret | Service account JSON key for Firebase CLI authentication |
| `FIREBASE_PROJECT_ID` | Variable | Firebase project ID used by deployment actions |

#### Downloading the Android APK

1. Go to the repository's **Actions** tab.
2. Select the **Android Debug APK Build** workflow.
3. Click on the latest successful run.
4. Download the `app-debug-apk` artifact from the **Artifacts** section.
5. Transfer the APK to your Android device and install it (enable "Install from unknown sources").

---

## Capacitor Notes

- `capacitor.config.ts` is initialized with `appId: com.oddyssey.app`, `appName: Oddyssey`, and `webDir: dist`.
- Plugins configured: SplashScreen (auto-hide disabled, dark background), StatusBar (dark style), Keyboard (body resize), ScreenOrientation, and Haptics.
- The `android/` directory is checked in and tracked by Git for CI builds.
- The Ionic CLI (`npx ionic capacitor run <platform>`) can streamline debugging once platforms are added.
- Remember to sync after every web build: `npx cap sync`.

### Building for Native Platforms

```bash
# Build web assets and sync to native projects
npm run cap:build

# Build and open in Android Studio
npm run cap:android

# Build debug APK directly (no Android Studio needed)
npm run cap:android:build-debug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Generating App Icons & Splash Screens

Source images are located in `resources/`:
- `resources/icon.png` (1024×1024) — app icon source
- `resources/splash.png` (2732×2732) — splash screen source

Replace these with your branded assets, then regenerate:

```bash
npm run generate:assets
```

This uses `@capacitor/assets` to produce all required sizes for iOS and Android.

### Prerequisites for Native Builds

- **iOS**: macOS with Xcode 15+, CocoaPods (`sudo gem install cocoapods`)
- **Android**: Android Studio, JDK 17+, Android SDK (API 33+)

---

## PWA & Offline Support

Oddyssey ships as a Progressive Web App with full offline capabilities:

### Service Worker

- Powered by `vite-plugin-pwa` with Workbox runtime caching.
- **App shell** (HTML, JS, CSS, images): pre-cached during build for instant offline loading.
- **Google Fonts/CDN**: CacheFirst with 30-day expiration.
- **Genkit API calls**: NetworkFirst with 24-hour offline fallback cache.
- **Firebase/Firestore**: NetworkOnly (real-time data is never stale-cached).
- Service worker auto-updates when new builds are deployed.
- On native platforms (iOS/Android), the service worker is disabled — Capacitor handles asset bundling.

### Offline Data (IndexedDB)

- AI-generated questions are cached in IndexedDB for offline play.
- Game records are mirrored to IndexedDB alongside localStorage for more reliable persistence.
- User preferences are stored in IndexedDB with localStorage as a synchronous fallback.
- The `useOfflineStatus` composable provides a reactive `isOffline` ref for UI feedback.

### PWA Manifest

- `public/manifest.json` defines the installable PWA configuration.
- App icons in `public/icons/` range from 72×72 to 512×512.
- Standalone display mode with portrait orientation.

---

## Roadmap

### 🔴 Phase 1 — Quality & Reliability (High Priority, Low Risk)

#### 1.1 Test Coverage Expansion

- **Current gap:** Only skeleton tests exist (1 unit, 1 e2e)
- **Unit tests needed:** gameStore logic (scoring, streaks, power cards, difficulty ramp), streak utility, question service (fallback chain: Genkit → cache → bank), offline database operations
- **E2E tests needed:** Full game flow (start → play → results), authentication flow (Google + guest), multiplayer matchmaking → lobby → game, friend request lifecycle, challenge send/accept/complete
- **Impact:** Prevents regressions as features grow; enables confident refactoring

#### 1.2 Error Monitoring & Analytics

- **Add:** Firebase Crashlytics (mobile) + Firebase Analytics or Sentry (web) for error tracking
- **Track:** Game completion rates, question answer distribution, power card usage patterns, theme popularity, session duration, funnel drop-offs (home → game → results)
- **Impact:** Data-driven product decisions; proactively catch production issues

#### 1.3 Cloud Functions Rate Limiting

- **Current gap:** No rate limiting on callable functions (`getLeaderboard`, `searchUsers`)
- **Add:** Per-user rate limiting middleware (e.g., 60 requests/minute for search, 10/minute for leaderboard)
- **Impact:** Prevents abuse and excessive Firebase costs

### 🟡 Phase 2 — Engagement & Retention (Medium Priority, Medium Effort)

#### 2.1 Achievements & Badges System

- **Concept:** Award badges for milestones — "First Perfect Round," "10-Streak Master," "Night Owl (played after midnight)," "Polyglot (played in 3 locales)," "Social Butterfly (10 friends)," "Event Champion"
- **Implementation:** New `achievementService.ts`, `achievementStore.ts`, `AchievementsPage.vue`, Firestore `achievements` subcollection under users
- **Impact:** Strong retention driver; gives players long-term goals beyond high scores

#### 2.2 Player Progression & Leveling

- **Concept:** XP system based on games played, scores, streaks, and challenges won. Level-up unlocks new themes, power card upgrades, or cosmetic items
- **Implementation:** XP calculation in Cloud Functions on game record creation, level thresholds, new progress bar UI on profile page
- **Impact:** Provides continuous sense of progression; motivation beyond individual scores

#### 2.3 Activity Feed & Social Timeline

- **Concept:** A feed showing friend activity — high scores, achievements unlocked, challenges completed, events joined
- **Implementation:** New `ActivityFeedPage.vue`, Firestore `activities` collection with fanout writes, real-time subscription
- **Impact:** Increases social engagement; drives competitive behavior through visibility

### 🟢 Phase 3 — Content & Variety (Medium Priority, Scalable)

#### 3.1 Theme Expansion

- **Current:** 7 themes — add 5-8 more: Movies & TV, Geography, Technology, Sports (general), Food & Cooking, Music (genres), Art & Literature, Mythology
- **Implementation:** Extend `themes.ts`, add question banks per locale, add theme icons and accent colors
- **Impact:** Directly increases replayability; appeals to broader audience

#### 3.2 Difficulty Modes

- **Concept:** Beyond the current auto-ramping difficulty, add selectable modes — "Casual" (90s timer, hints), "Standard" (current 60s), "Expert" (30s, no power cards), "Endless" (no timer, survive until 3 wrong)
- **Implementation:** Extend `GameSessionSnapshot` type with `mode` field, adjust `gameStore` timer/power-card logic per mode
- **Impact:** Appeals to different player skill levels; adds variety for experienced players

### 🔵 Phase 4 — Multiplayer & Social Expansion (High Effort, High Reward)

#### 4.1 Team/Clan System

- **Concept:** Players form teams (3-10 members) that compete in team events, aggregate scores, and have team leaderboards
- **Implementation:** Firestore `teams` collection, team management page, team invites, aggregate score Cloud Functions
- **Impact:** Deepens social bonds; creates another layer of competition

#### 4.2 Social Sharing & Replay

- **Concept:** Generate shareable result cards (image) for social media showing score, streak, theme, and a challenge link
- **Implementation:** Canvas/SVG-based result image generation, Web Share API integration, deep link to challenge
- **Impact:** Organic growth through social sharing; viral loop potential

### 🟣 Phase 5 — Monetization & Platform (Strategic)

#### 5.1 Cosmetic Customization

- **Concept:** Unlockable/purchasable avatar frames, question card skins, power card visual effects, victory animations
- **Implementation:** Firestore `inventory` subcollection, cosmetics catalog, equipped items in user profile, render pipeline for custom visuals
- **Impact:** Non-pay-to-win monetization; self-expression for players

#### 5.2 Push Notifications

- **Current gap:** No push notification support
- **Concept:** Notify for friend requests, challenge invites, event starts, daily challenge reminders, match found
- **Implementation:** Firebase Cloud Messaging (FCM), Capacitor Push Notifications plugin, notification preferences page
- **Impact:** Re-engagement for inactive users; time-sensitive feature awareness

#### 5.3 Admin Dashboard

- **Concept:** Web-based admin panel for managing themes, reviewing submitted questions, moderating reports, viewing analytics, managing events manually
- **Implementation:** Separate Vue app or Firebase Admin SDK integration, role-based access control
- **Impact:** Operational efficiency; enables non-developer content management

### 🔧 Phase 6 — Technical Excellence (Ongoing)

#### 6.1 Performance Optimization

- **Code splitting audit:** Analyze bundle size (currently triggers 500kB warning), split heavy dependencies (firebase, ionicons)
- **Image optimization:** Lazy-load theme icons, use WebP format, implement responsive images
- **Prefetching:** Preload likely next routes (e.g., GamePage when on HomePage)

#### 6.2 Offline Sync Queue

- **Current gap:** Offline game records are stored but not automatically synced
- **Concept:** Background sync queue that automatically uploads game records, challenge results, and friend requests when connectivity returns
- **Implementation:** Workbox Background Sync plugin or custom queue in IndexedDB with retry logic

#### ~~6.3 Automated CI/CD Pipeline~~ ✅ Completed

- ~~**Current gap:** No GitHub Actions or CI configuration~~
- **Implemented:** GitHub Actions workflows for CI (PR checks + preview deploy), production deploy (Hosting + Functions), and Android debug APK builds. See [Deployment](#deployment).

---

Oddyssey's modular architecture is designed to grow as the content library, player base, and platform coverage expand.

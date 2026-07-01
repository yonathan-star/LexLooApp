# LexLoo

The Wear & Learn MVP: scan a physical word tile, learn the word, practice it, earn XP, build a streak, and master it over time. Built from `PRD.md` in this repo, sprint-by-sprint in the order the PRD itself specifies (Auth → schema → seed → onboarding → scanner → word detail → practice → progress → gamification → parent → admin → analytics → polish).

## Architecture

```
server/   Express + Prisma (SQLite) API — the single source of truth for all three clients
mobile/   React Native + Expo + TypeScript app (the actual product)
admin/    Next.js admin dashboard (content + tile operations)
```

**Why SQLite instead of Supabase/Postgres as the PRD recommends:** this environment has no Docker and no cloud credentials, so a managed Supabase project wasn't available to provision. The schema (`server/prisma/schema.prisma`) is a 1:1 mapping of the PRD's 27-table data model (Database Tables 1-27 in the PRD), accessed only through a typed service layer (`server/src/services/*`, `server/src/routes/*`) — never directly from UI code. Swapping the Prisma datasource from `sqlite` to `postgresql` and pointing `DATABASE_URL` at a Supabase project is the entire migration; no application code changes.

All three apps talk to the same backend over HTTP/JSON (`{ success, data, error, meta }` shape, per PRD API section). The mobile app and admin dashboard never read word/pack/tile content directly from a database — everything goes through the API, so the PRD rule "never hardcode word data in the UI" holds.

## Running it

### 1. Backend (start this first)

```bash
cd server
npm install
npx prisma migrate dev   # creates dev.db with the full schema
npm run seed             # seeds English/SAT/Spanish/Hebrew packs, badges, missions, demo accounts
npm run dev               # http://localhost:4000
```

Demo accounts created by the seed script:
- **Admin:** `admin@lexloo.com` / `LexLooAdmin123!`
- **Student:** `demo@lexloo.com` / `LexLooDemo123!`

Sample tile codes are printed at the end of the seed run (e.g. `LEX1001` = "Discipline"). Use these in the mobile app's manual code entry screen to simulate a scan without a physical tile or a real camera/QR target.

### 2. Mobile app

```bash
cd mobile
npm install
npx expo start
```

Scan the QR with Expo Go, or press `i`/`a` for a simulator. The app auto-detects the Metro bundler's host IP so it can reach the backend from a physical device on the same network; override with `EXPO_PUBLIC_API_URL` if needed.

### 3. Admin dashboard

```bash
cd admin
npm install
npm run dev   # http://localhost:3000
```

Log in with the admin demo account above. From there: create/edit words and packs, assign tile codes, generate QR batches, review content QA issues, search users, and view scan/event analytics.

## What's implemented

- **All 85 PRD screens**, screen-by-screen, in the PRD's own dependency order. A few are intentionally merged where the PRD itself flags overlap (e.g. Word Detail's six sub-screens share one screen with tabs; Saved Word detail reuses Word Detail rather than duplicating it, per the PRD's own note).
- **The full daily loop**: scan → word detail → practice (flashcards / multiple choice / spelling / match) → XP → streak → badges → missions, all backed by real persisted state, not mock data.
- **Gamification engine** (`server/src/services/gamification.ts`): deterministic XP rules, timezone-aware streak counting that never punishes below 1, mastery requiring repeated correct attempts (not a single tap), and badge evaluation.
- **Parent dashboard**: multi-child accounts, weekly reports, child detail view — no invasive data, just learning signals.
- **Admin dashboard**: word/pack CRUD with draft/publish workflow, tile code assignment + batch QR generation + CSV export, content QA, basic analytics, user search, audit logging.
- **Analytics events** fire from both server-side mutations (scans, quizzes, badges) and client-side screen views (`POST /analytics/event`), satisfying the PRD's "every screen tracked" rule.

## Documented assumptions

- **Backend platform**: SQLite via Prisma instead of Supabase/Firebase (see Architecture above) — schema and service-layer boundaries are preserved so this is a connection-string change, not a rewrite.
- **Notification preferences** (Screen 50) are stored on-device (`AsyncStorage`) rather than server-side, since the PRD schema doesn't define a per-profile preferences table; actual push delivery isn't wired up since there's no production push credential to register against in this environment.
- **Match Definitions game** (Screen 36) is implemented as sequential single-word matching against the same distractor set as Multiple Choice, rather than a simultaneous multi-pair board — same learning mechanic, simpler MVP build.
- **Sentence Builder** (Screen 38) is ungraded per the PRD's own note that AI evaluation is future work; submissions are saved to learning history but not scored.
- **Tile Not Owned** (Screen 58) exists as a screen but isn't wired into the live scan flow, matching the PRD's explicit note that "MVP may simply allow access."
# LexLooApp
# LexLooApp

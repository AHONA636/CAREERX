# CareerX

An AI-powered Student & Career Intelligence Platform. CareerX verifies real skills, identifies skill gaps, and builds a personalized, goal-driven roadmap from learning to placement.

This is the **frontend** of CareerX — a fully interactive prototype built on realistic mock data. There is no backend yet; see [Backend Integration](#backend-integration) below.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Recharts (charts)
- Framer Motion (animation)
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint     # oxlint
```

## Project Structure

```
src/
├── components/       # Reusable UI, layout, chat, roadmap, chart components
├── pages/            # Route-level pages (student/educator/admin/auth)
├── context/           # AppContext — the single client-side state store
├── data/              # Mock data (single source of truth for skills/goals)
├── hooks/              # useLocalStorageState, etc.
└── router/             # RequireAuth, ScrollToTop
```

## Architecture Notes

- **`src/data/mockData.js`** is the single source of truth for skills, career
  goals and derived stats. `skillsCatalog` holds every tracked skill; counts,
  the Skill Gap chart, and Priority Improvements are all *derived* from it via
  pure functions (`deriveSkillCounts`, `deriveSkillGapTarget`,
  `derivePriorityImprovements`) rather than duplicated as separate hand-authored
  arrays, so they can't drift out of sync with each other.
- **`src/context/AppContext.jsx`** holds all mutable app state (auth, the live
  skills catalog, career goal, assessments, notifications) and is persisted to
  `localStorage` so a page refresh doesn't discard in-session progress or log
  the user out. Logging out clears all persisted state for a clean demo reset.
- Verifying a skill in **Skill Verification** propagates live to the
  Dashboard's stat cards, the **Skill Gap** page's chart/chips/priority list,
  and the **Profile** page's skill badges — all recomputed from the same
  underlying `skills` state.

## Backend Integration

Everything currently reads from `src/data/mockData.js` /
`src/data/educatorAdminMockData.js` through `AppContext`. To connect a real
backend, replace the state/actions inside `AppContext.jsx` (`login`,
`verifySkill`, `completeAssessment`, `updateCareerGoal`, etc.) with real API
calls — the components that consume `useApp()` don't need to change. Areas
that still need a real implementation: authentication/session, the
skill-verification and assessment-scoring engine, skill-gap/roadmap
generation, opportunity matching, and the AI Mentor's LLM backend (currently
keyword-matched canned responses).

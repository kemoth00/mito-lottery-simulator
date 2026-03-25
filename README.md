# mito-lottery-simulator

Full-stack lottery simulator built with React, Node.js, PostgreSQL, and Docker.

## Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS          |
| Backend  | Node.js + Express + TypeScript          |
| ORM      | Prisma                                  |
| Database | PostgreSQL 16                           |
| DevOps   | Docker + Docker Compose                 |

## Project structure

```
mito-lottery-simulator/
├── frontend/        # React + Vite + Tailwind CSS
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Prisma data model
│   │   └── migrations/      # Auto-generated SQL migrations
│   └── src/                 # Express API (TypeScript)
├── docker-compose.yml
├── .env             # Root env vars (Postgres credentials)
└── .env.example
```

## Getting started

### With Docker (recommended)

```bash
cp .env.example .env
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:3001      |
| Postgres | localhost:5432             |

### Without Docker

**Prerequisites:** Node.js 20+, PostgreSQL 16+

```bash
# Backend
cp backend/.env.example backend/.env   # set DATABASE_URL
cd backend && npm install
npx prisma migrate deploy              # apply DB migrations
npm run dev

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

## Environment variables

Root `.env` (used by Docker Compose):

| Variable          | Default       | Description            |
|-------------------|---------------|------------------------|
| `POSTGRES_DB`     | mito_lottery  | Database name          |
| `POSTGRES_USER`   | postgres      | Postgres user          |
| `POSTGRES_PASSWORD` | *(required)* | Postgres password — set a strong value |

Backend `backend/.env`:

| Variable        | Description                       |
|-----------------|-----------------------------------|
| `PORT`          | API port (default 3001)           |
| `DATABASE_URL`  | Full postgres connection string   |
| `CORS_ORIGIN`   | Allowed frontend origin           |

---

## Testing

Both backend and frontend have unit test suites powered by **Vitest**.

### Run locally

```bash
# Backend (31 tests — draw logic + simulation engine)
cd backend && npm test

# Frontend (44 tests — stores + formatters)
cd frontend && npm test
```

### Run via Docker Compose (no local Node.js required)

Run all test suites using the provided script — backend followed by frontend, exits non-zero if either fails:

```bash
./test.sh
```

Or run a single suite directly:

```bash
docker compose --profile test run --rm backend-test
docker compose --profile test run --rm frontend-test
```

> **Why not `docker compose up --abort-on-container-exit`?**
> That flag stops all containers the moment *any* one exits. Since backend tests finish in ~360ms and frontend tests take longer, the frontend container gets killed (SIGTERM) before it completes. Sequential `run --rm` avoids this entirely.

### What is covered

**Backend**

| File | Tests | What is covered |
|---|---|---|
| `simulation/drawLogic.test.ts` | 13 | `generateNumbers` (uniqueness, range, sort), `countMatches`, `validatePlayerNumbers` |
| `simulation/simulationEngine.test.ts` | 18 | Tick result shape, stats accumulation, jackpot / max-draws termination, random mode |

**Frontend**

| File | Tests | What is covered |
|---|---|---|
| `shared/utils/formatters.test.ts` | 8 | `formatSpaced` and `formatHuf` — digit preservation, HUF suffix, zero |
| `features/player/store/playerStore.test.ts` | 10 | `setMode`, `toggleNumber` (add / remove / sort / 5-number cap), `reset` |
| `features/draw/store/drawStore.test.ts` | 6 | `setDraw` stores all values and overwrites on repeat, `reset` |
| `features/stats/store/statsStore.test.ts` | 7 | `setStats`, jackpot win scenario, `reset` to zero |
| `features/simulation/store/simulationStore.test.ts` | 13 | All status transitions, `setSessionId`, `setSpeed`, `reset` |

---

## Architecture

### Backend

#### Overview

The backend is a **Node.js + Express** application written in **TypeScript**. It is responsible for all game logic, random number generation, session management, statistics calculation, and persistence. The frontend is purely presentational — it drives the simulation tick-by-tick via REST and renders whatever the backend returns.

#### Directory structure

```
backend/src/
│
├── api/
│   ├── routes/
│   │   ├── health.routes.ts          # GET /api/health
│   │   └── session.routes.ts         # Session + tick endpoints
│   └── middleware/
│       ├── errorHandler.ts           # Centralised error responses
│       └── validate.ts               # Zod-based request validation factory
│
├── simulation/
│   ├── drawLogic.ts                  # Pure functions: generate draw, count matches
│   └── simulationEngine.ts          # Stateless: run one tick, return result + updated stats
│
├── db/
│   ├── pool.ts                       # Prisma client singleton
│   └── repositories/
│       ├── sessionRepository.ts      # CRUD for sessions
│       └── drawResultRepository.ts   # Insert/query winning draws (match ≥ 2)
│
└── index.ts                          # Express app bootstrap
```

The Prisma schema lives in `backend/prisma/schema.prisma`. Migrations are generated with `npx prisma migrate dev` and applied automatically on container start via `npx prisma migrate deploy`.

#### API contract

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | DB connectivity check |
| `POST` | `/api/sessions` | Create a new session, returns `{ sessionId }` |
| `POST` | `/api/sessions/:id/tick` | Run one draw, returns result + cumulative stats |
| `POST` | `/api/sessions/:id/stop` | Mark session as stopped |
| `GET` | `/api/sessions/:id/stats` | Fetch final stats for a session |

**`POST /api/sessions` request body**
```json
{ "playerMode": "fixed" | "random", "playerNumbers": [3, 14, 33, 67, 81] }
```
`playerNumbers` is required when `playerMode` is `"fixed"`, ignored otherwise.

**`POST /api/sessions/:id/tick` response**
```json
{
  "draw": [7, 14, 33, 55, 81],
  "playerNumbers": [3, 14, 33, 67, 81],
  "matchCount": 2,
  "stats": {
    "tickets": 104,
    "yearsElapsed": 2,
    "totalCost": 31200,
    "wins": { "2": 3, "3": 0, "4": 0, "5": 0 }
  },
  "status": "active" | "jackpot" | "max_draws_reached"
}
```

#### Key design decisions

**ORM — Prisma**
All DB access goes through the Prisma client. The schema in `prisma/schema.prisma` is the single source of truth for the data model. `prisma migrate deploy` is run automatically in the Docker dev container on startup.

**TypeScript throughout**
Both backend and frontend use TypeScript. Shared types (draw result shape, session status, stats) live close to their domain and are not shared across packages — each side defines what it needs.

**Stateless simulation engine**
`simulationEngine.ts` is a pure function: given the current session state and player numbers it produces the next draw result and updated stats, with no side effects. This makes it trivially unit-testable.

**Randomness — `crypto.randomInt`**
Node's built-in `crypto.randomInt` is used for all number generation. It is cryptographically secure and avoids the biases of `Math.random()`.

**Session = browser tab, no auth**
`POST /api/sessions` returns a UUID. The frontend stores it in `sessionStorage` (cleared on tab close). Two tabs = two independent sessions. No login, no user accounts — the spec's "multiple users" requirement is satisfied implicitly.

**Persistence — wins only**
Only draws with `matchCount >= 2` are written to `draw_results`. Stats (ticket count, total cost, win breakdown) are accumulated in-memory per session during its lifetime and returned on every tick response. This avoids writing up to 26,000 rows per session for a full 500-year simulation.

**Migrations auto-run on startup**
`migrate.ts` runs all `.sql` files in `db/migrations/` in filename order when the server starts. This ensures `docker compose up` produces a fully ready database with no manual steps.

**Validation with Zod**
All request bodies are validated with Zod schemas before reaching route handlers. A thin `validate` middleware factory wraps each schema and returns a structured `400` on failure.

**Testing with Vitest**
Unit tests cover `drawLogic.ts` and `simulationEngine.ts` — the pure-function core. Integration tests (optional) can test repositories against a real DB using a test-scoped schema.

---

### Frontend

#### Overview

The frontend is a **React 18 + Vite + TypeScript** application styled with **Tailwind CSS**. It is purely presentational — all game logic lives on the backend. The UI drives the simulation tick-by-tick via REST polling and renders whatever the backend returns.

#### Directory structure

```
frontend/src/
│
├── features/
│   ├── simulation/
│   │   ├── components/
│   │   │   └── SpeedSlider.tsx          # 10ms–1000ms range, left=slow right=fast
│   │   ├── hooks/
│   │   │   └── useSimulation.ts         # polling loop, tick-in-flight guard, session lifecycle
│   │   ├── store/
│   │   │   └── simulationStore.ts       # status, sessionId, speed
│   │   └── index.ts
│   │
│   ├── player/
│   │   ├── components/
│   │   │   ├── PlayerModeToggle.tsx     # "Play with random numbers" checkbox
│   │   │   └── NumberGrid.tsx           # 9×10 grid, shown only in fixed mode
│   │   ├── store/
│   │   │   └── playerStore.ts           # mode (fixed|random), selectedNumbers: number[]
│   │   └── index.ts
│   │
│   ├── draw/
│   │   ├── components/
│   │   │   └── DrawRow.tsx              # "Winning numbers" + "Your numbers" ball rows
│   │   ├── store/
│   │   │   └── drawStore.ts             # currentDraw, currentPlayerNumbers, matchCount
│   │   └── index.ts
│   │
│   └── stats/
│       ├── components/
│       │   ├── StatsSummary.tsx         # teal box: tickets, years, cost
│       │   └── WinsBreakdown.tsx        # 2×2 / 4-column responsive grid
│       ├── store/
│       │   └── statsStore.ts            # tickets, yearsElapsed, totalCost, wins
│       └── index.ts
│
├── shared/
│   ├── api/
│   │   └── simulationApi.ts             # createSession, tick, stop
│   ├── components/
│   │   ├── Ball.tsx                     # lottery ball chip — variants: normal|matched|jackpot
│   │   └── Layout.tsx                   # gradient header + page shell
│   ├── constants.ts                     # MAX_PLAYER_NUMBERS, TOTAL_LOTTERY_NUMBERS, speed bounds
│   ├── interfaces/                      # all TypeScript interfaces (one file each)
│   │   ├── index.ts                     # barrel export
│   │   ├── ballProps.interface.ts
│   │   ├── createSessionResponse.interface.ts
│   │   ├── drawState.interface.ts
│   │   ├── layoutProps.interface.ts
│   │   ├── playerState.interface.ts
│   │   ├── sessionStats.interface.ts
│   │   ├── simulationState.interface.ts
│   │   ├── statsState.interface.ts
│   │   ├── tickResponse.interface.ts
│   │   └── winsBreakdown.interface.ts
│   ├── types/                           # primitive type aliases + re-export shims → interfaces/
│   │   ├── index.ts
│   │   ├── playerMode.types.ts
│   │   ├── sessionStatus.types.ts
│   │   └── …
│   └── utils/
│       └── formatters.ts                # formatHuf(n), formatSpaced(n) — "1 234 567"
│
├── App.tsx
├── main.tsx
└── index.css
```

#### Start / Stop / Reset button

A single adaptive button driven by `simulationStore.status`:

| Status | Label | Action |
|---|---|---|
| `idle` | **Start** | `createSession()` → begin polling |
| `running` | **Stop** | `POST /sessions/:id/stop` → halt polling |
| `jackpot` / `max_draws_reached` / `stopped` | **Start again** | Reset all stores → `createSession()` → begin polling |

#### NumberGrid (fixed mode)

- 9 rows × 10 columns covering numbers 1–90
- Tap a number → marks it with ✕ + teal highlight; it appears in "Your numbers" sorted ascending
- Tap a marked number → removes it from the selection
- Max 5 numbers; remaining unmarked cells are disabled until a selection is removed
- The grid is disabled (read-only) while a simulation is running

#### Tick guard

```ts
if (isTickInFlight.current) return   // don't stack requests
isTickInFlight.current = true
try { await tick() } finally { isTickInFlight.current = false }
```

Prevents request pile-up at the 10ms minimum speed.

#### Jackpot state

- Ball rows switch to a golden `jackpot` variant
- The "5 matches" cell in WinsBreakdown gets a golden highlight
- `yearsElapsed` in StatsSummary is highlighted
- Polling stops; "Start again" button appears

#### Key design decisions

**Feature-based architecture**
Each feature is a self-contained vertical slice (components + store + hooks). A feature never imports from another feature — only from `shared/`.

**State management — Zustand**
One lightweight store per feature. No boilerplate, no context providers, easy to reset on "Start again".

**REST polling — frontend-driven ticks**
The frontend fires `POST /tick` on each interval. Speed slider directly controls the `setInterval` delay. Changing speed mid-simulation takes effect on the next tick without restarting the session.

**Session identity via store**
`sessionId` is kept in `simulationStore` (Zustand) for the lifetime of the page. Two tabs = two independent sessions. No login, no user accounts — the spec's "multiple users" requirement is satisfied implicitly.


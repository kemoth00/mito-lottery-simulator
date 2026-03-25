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


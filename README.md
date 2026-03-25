# mito-lottery-simulator

Full-stack lottery simulator built with React, Node.js, PostgreSQL, and Docker.

## Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS     |
| Backend  | Node.js + Express                  |
| Database | PostgreSQL 16                      |
| DevOps   | Docker + Docker Compose            |

## Project structure

```
mito-lottery-simulator/
├── frontend/        # React + Vite + Tailwind CSS
├── backend/         # Express API + pg
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
cp backend/.env.example backend/.env   # edit DATABASE_URL if needed
cd backend && npm install && npm run dev

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


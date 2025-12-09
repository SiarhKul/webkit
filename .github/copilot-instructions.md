# Copilot / AI Agent Instructions for the Webkit repo

This file gives focused, actionable information to help an AI coding agent be productive in this codebase.

Summary

- Tech: Node.js + TypeScript, Express (v5), TypeORM, PostgreSQL, Grafana/Loki logging.
- Dev runtime: `tsx` for hot dev, `tsc` for build. Tests with `vitest`.

Big picture

- Entrypoint: `src/main.ts` — initializes DB (`src/integrations/postgress/database.ts`), checks Loki (`src/integrations/loki.ts`), then starts the Express server (`src/server.ts`).
- HTTP surface: `src/app.ts` mounts routers (`src/routes/*`) and global middlewares (`src/middlewares/*`).
- Persistence: TypeORM DataSource at `src/integrations/postgress/data-source.ts` with entities in `src/entity/*` and migrations output to `src/migration/*.ts`.
- Logging: Winston + `winston-loki` in `src/integrations/logger.ts`; enabled when `LOG_TO_LOKI=true` and `LOKI_HOST` is set.

Developer workflows & commands

- Install deps: `npm install`.
- Local DB (recommended): `docker compose up -d` (uses `docker-compose.yml`). Defaults: `localhost:5432`, DB `db-webkit`, user `user`.
- Dev server (watch): `npm run start:local` or `npm run start:dev` (both use `tsx --watch`).
- Debug: `npm run start:debug` (Node inspector enabled).
- Build: `npm run build` (runs `tsc`).
- Migrations: use TypeORM wrapper scripts in `package.json`:
  - Generate: `npm run migration:generate -- src/migration/<Name>`
  - Run: `npm run migration:run`
  - Revert: `npm run migration:revert`
  - Note: `data-source` path passed is `src/integrations/postgress/data-source.ts`.
- Tests:
  - Unit: `npm run test:unit` (Vitest project matching `**/*.unit.*`)
  - Integration: `npm run test:integ` (Vitest project `**/*.integ.*`, uses `src/integrations/testcontainer/setup.ts`)
  - Run all: `npm test` or `vitest --run`.
  - Coverage: `npm run coverage` (V8 provider, `text/json/html`).

Project-specific conventions & patterns

- Tests naming: three Vitest projects configured in `vitest.config.ts` — use suffixes `.unit.`, `.integ.`, `.e2e.` before the test extension to target the right project.
- Testcontainers: integration tests spin up a PostgreSQL container using `@testcontainers/postgresql` (see `src/integrations/testcontainer/setup.ts`). Integration tests rely on an ephemeral DB with `synchronize: true`.
- Env loading: `src/integrations/config.ts` loads `.env` then `.env.{NODE_ENV}` and validates with `zod`. Use these env var names when running locally: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_LOGGING`, `DB_SYNCHRONIZE`, `LOG_TO_LOKI`, `LOKI_HOST`.
- Logging to Loki: main process will `checkLokiHealth()` and exit on failure. Set `LOG_TO_LOKI=true` and `LOKI_HOST` to enable; otherwise the app still runs but health endpoints reflect status.
- Graceful shutdown: `src/utils/graceful-shutdown.ts` is used by `startServer()` to close the server cleanly.
- Seed data: `src/scripts/seed-users.ts` uses `AppDataSource` to populate example data.

Where to make changes (examples)

- Add/update entity: `src/entity/*.ts` → then `npm run migration:generate -- src/migration/<name>`.
- Add route/controller: follow `src/routes/user.ts` and `src/controllers/*` patterns — controllers are lightweight functions that call repositories in `src/repositories/*`.
- Add middleware: put in `src/middlewares/` and mount in `src/app.ts` (request/response loggers are already used).

Integration points

- PostgreSQL: configured in `src/integrations/postgress/data-source.ts` and started via Docker Compose or Testcontainers for tests.
- Loki: readiness checked in `src/integrations/loki.ts` and referenced by `src/controllers/HealthCheck.ts` for `/ready`.
- PM2: `ecosystem.config.cjs` and `package.json` `pm2:*` scripts are available for process management in production-like setups.

Quick examples

- Start local dev with Docker DB:
  - `docker compose up -d`
  - `npm run start:local`
- Generate migration after entity change:
  - `npm run migration:generate -- src/migration/add-email`
- Run integration tests:
  - `npm run test:integ`

Notes for AI agents

- Prefer editing or adding files that follow existing structure: `routes` → `controllers` → `repositories` → `integrations`.
- When changing DB entities, update or generate migrations (do not manually edit compiled `build/` files).
- Use `vitest` project selectors and the `testcontainer` setup when proposing or running integration tests.
- Avoid assuming Loki is present — respect `LOG_TO_LOKI` gating and the health-check behavior in `src/main.ts`.
- If anything above is unclear or you want examples expanded (e.g., a concrete integration test or a sample migration), tell me which section to expand.

# Webkit API (Express + TypeORM + PostgreSQL)

A minimal REST API starter built with:

- Node.js + TypeScript
- Express (v5)
- TypeORM (0.3)
- PostgreSQL (via Docker Compose)

The project exposes a sample endpoint that returns a mock list of employees and includes a TypeORM configuration with a `User` entity and migration scripts.

## Table of Contents

- Prerequisites
- Getting Started
  - Clone and install
  - Start PostgreSQL with Docker
  - Configure environment
  - Run the server
- Scripts
- Configuration (Environment Variables)
- Database and Migrations
- API
- Troubleshooting

## Prerequisites

- Node.js 18+ and npm
- Docker + Docker Compose (optional, recommended for PostgreSQL)

## Getting Started

### 1) Clone and install

```sh
npm install
```

### 2) Start PostgreSQL with Docker (recommended)

A ready-to-use docker-compose file is provided.

```sh
# In PowerShell or your shell of choice
docker compose up -d
```

This starts a PostgreSQL 16 instance with:

- Host: localhost
- Port: 5432
- User: user
- Password: password
- Database: db-webkit

Data will persist in the local `postgres-data` directory.

### 3) Configure environment (optional)

The app reads database settings from environment variables. Defaults match the provided docker-compose.

PowerShell example (Windows):

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_USER = "user"
$env:DB_PASSWORD = "password"
$env:DB_NAME = "db-webkit"
$env:DB_LOGGING = "false"       # set to "true" to see SQL logs
$env:DB_SYNCHRONIZE = "false"   # set to "true" for dev-only auto schema sync
```

Bash example (macOS/Linux):

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=user
export DB_PASSWORD=password
export DB_NAME=db-webkit
export DB_LOGGING=false
export DB_SYNCHRONIZE=false
```

### 4) Run the server

Development (with tsx):

```sh
npm run dev
```

Or simply:

```sh
npm start
```

The server listens on port 3002.

## Scripts

Defined in `package.json`:

- `npm run dev` / `npm start` — start the server with tsx: `tsx src/main.ts`
- `npm run build` — compile TypeScript to JavaScript via `tsc`
- `npm run migration:generate` — generate a migration from current model changes
- `npm run migration:run` — run pending migrations
- `npm run migration:revert` — revert the last migration

## Configuration (Environment Variables)

The TypeORM DataSource (src\integrations\data-source.ts) uses:

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `5432`)
- `DB_USER` (default: `user`)
- `DB_PASSWORD` (default: `password`)
- `DB_NAME` (default: `db-webkit`)
- `DB_LOGGING` (`true` | `false`, default: `false`)
- `DB_SYNCHRONIZE` (`true` | `false`, default: `false`)

Note: Keep `DB_SYNCHRONIZE=false` in non-development environments. Use migrations to manage schema.

## Database and Migrations

- DataSource file: `src\integrations\data-source.ts`
- Entities: currently `src\entity\User.ts`
- Migrations directory: `src/migration/*.ts` (create this folder when generating migrations)

Typical flow:

```sh
# Create
npm run migration:create src/migration/<MigrationName>

# Generate migration from entity changes
npm run migration:generate -- src/migration/<MigrationName>

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

#Example:
npm run migration:generate -- src/migration/add-email
```

If you prefer quick development without migrations, you can temporarily set `DB_SYNCHRONIZE=true` (not recommended for production) to let TypeORM auto-sync the schema based on entities.

## API

Base URL (default): `http://localhost:3002`

- GET `/` — returns a mock list of employees
  - Controller: `src\controllers\EmployController.ts`
  - Repository: `src\repositories\EmployeeRepository.ts`

Example request:

```sh
curl http://localhost:3002/
```

Example response:

```json
[{ "id": 1 }, { "id": 2 }]
```

## Project Structure (key files)

- `src/app.ts` — Express app, sets port and mounts routes
- `src/main.ts` — App bootstrap and database initialization
- `src/routes/employee.ts` — Router exposing GET `/`
- `src/controllers/EmployController.ts` — Controller handler
- `src/repositories/EmployeeRepository.ts` — Mock data repository
- `src/integrations/data-source.ts` — TypeORM DataSource configuration
- `src/entity/User.ts` — Example User entity
- `docker-compose.yml` — Local PostgreSQL service

## Troubleshooting

- Database connection fails / timeout
  - Ensure Docker container is running: `docker compose ps`
  - Verify env vars match docker-compose credentials
  - Confirm port 5432 is not blocked by another service
- Migrations do nothing
  - Ensure your entities are included in the DataSource `entities` array
  - Make sure the `src/migration` folder exists and you pass a proper output path when generating
- Application starts but queries fail
  - The server begins listening before DB init completes. Check logs for `Database initialized` to confirm connection. Add retry or health checks if needed for your environment.

## License

ISC (see package.json).

curl http://localhost:3100/ready

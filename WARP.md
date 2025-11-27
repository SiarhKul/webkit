# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A REST API built with Node.js, TypeScript, Express v5, TypeORM 0.3, and PostgreSQL. The project includes Grafana Loki integration for centralized logging and follows a clean layered architecture pattern.

## Common Commands

### Development

```powershell
# Start PostgreSQL, Loki, and Grafana with Docker
docker compose up -d

# Start dev server (tsx with watch mode)
npm run start:local

# Start with automatic migration run
npm run start:local:migratin

# Debug mode with inspector on port 9210
npm run start:debug

# CPU profiling
npm run prof:cpu
```

### Database Management

```powershell
# Run pending migrations
npm run migration:run

# Generate migration from entity changes
npm run migration:generate -- src/migration/<MigrationName>

# Create empty migration file
npm run migration:create src/migration/<MigrationName>

# Revert last migration
npm run migration:revert

# Seed users
npm run seed:users
```

### Testing

```powershell
# Run all tests (unit and integration)
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run coverage
```

### Code Quality

```powershell
# Build TypeScript
npm run build

# Lint (configured via eslint.config.mjs with typescript-eslint)
npx eslint .

# Format (runs automatically on pre-commit via husky + lint-staged)
npx prettier --write .
```

## Architecture

### Layered Structure

The codebase follows a strict layered architecture:

- **Routes** (`src/routes/*.ts`) - Define HTTP endpoints and middleware chains
- **Controllers** (`src/controllers/*.ts`) - Handle request/response, validation via class-validator
- **Services** (`src/services/*.ts`) - Business logic layer (thin in current implementation)
- **Repositories** (`src/repositories/*.ts`) - Data access layer with TypeORM
- **Entities** (`src/entity/*.ts`) - TypeORM entities with validation decorators

### Key Components

**Application Bootstrap** (`src/main.ts`):

- Initializes TypeORM DataSource
- Checks Loki readiness before starting
- Sets up graceful shutdown handler
- Entry point for all environments

**Configuration** (`src/integrations/config.ts`):

- Uses Zod for environment variable validation
- Loads `.env` then `.env.{NODE_ENV}` with override behavior
- Supports: local, development, test, production environments
- Required vars: DB\_\*, PORT, NODE_ENV, LOG_TO_LOKI, LOKI_HOST

**Database** (`src/integrations/data-source.ts`):

- TypeORM DataSource configuration
- Entities must be manually registered in the `entities` array
- Migrations directory: `src/migration/*.ts`
- **IMPORTANT**: Keep `DB_SYNCHRONIZE=false` in non-development environments

**Logging** (`src/integrations/logger.ts`):

- Winston logger with console and optional Loki transports
- Loki enabled when `LOG_TO_LOKI=true` and `LOKI_HOST` is set
- Logs labeled as `be-{NODE_ENV}-webkit` in Loki

### Error Handling

**Custom Error Class** (`src/sharable/AppError.ts`):

- Extends Error with structured properties: statusCode, code, isOperational
- Used for operational errors (validation, not found, duplicates)

**Error Handler** (`src/handlers/errorHandler.ts`):

- Centralized error middleware
- Maps AppError codes to appropriate HTTP responses
- Uses JSend response format (ErrorResponse/SuccessResponse)
- Logs uncaught errors to Winston

**Error Codes** (`src/sharable/jsend/ErrorCodes.ts`):

- VALIDATION_ERROR (422)
- ENTITY_NOT_FOUND (404)
- DUPLICATE_DATA (409)
- TOO_MANY_REQUESTS (429)

### Middleware Chain

Standard request flow includes:

1. `requestMiddleware` - Logs incoming requests
2. `responseMiddleware` - Logs outgoing responses
3. `helmet()` - Security headers
4. `bodyParser.json()` - Parse JSON bodies
5. Route-specific middleware:
   - `limiter` - Rate limiting (20 req/min per IP)
   - `speedLimiter` - Slow down repeated requests
   - `validateParameter` - express-validator for route params

### Validation Strategy

**Entity Validation**:

- Uses `class-validator` decorators on entity classes
- Controllers validate using `validate()` function before saving
- Example: `@Length(0, 255)`, `@IsEmail()` on User entity

**Parameter Validation**:

- Uses `express-validator` middleware in routes
- Example: `validateParameter('id')` ensures positive integer IDs

### Testing Infrastructure

**Unit Tests** (`*.unit.test.ts`):

- Run with Vitest
- No database connection required

**Integration Tests** (`*.integ.test.ts`):

- Use Testcontainers to spin up isolated PostgreSQL instances
- Setup in `src/integrations/testcontainer/setup.ts`
- Override `UserRepository.userRep` with test DataSource
- Reset database between tests with `resetTestDatabase()`
- Use `createUserData()` helper from `src/helpers/user-factory.ts`

## Environment Configuration

The project uses environment-specific `.env` files:

- `.env` - Base configuration
- `.env.local` - Local development (committed example)
- `.env.development` - Development environment
- `.env.test` - Test environment
- `.env.production` - Production environment

**Database defaults** (match docker-compose.yml):

- Host: localhost
- Port: 5432
- User: user
- Password: password
- Database: db-webkit

**Loki defaults**:

- Host: http://localhost:3100
- Check readiness at `/ready` endpoint

## Docker Services

The `docker-compose.yml` provides three services:

1. **db-webkit** - PostgreSQL 16 Alpine (port 5432)
2. **loki** - Grafana Loki (port 3100)
3. **grafana** - Grafana dashboard (port 3000, admin/admin)

Data persists in local directories: `postgres-data/`, `loki-data/`, `grafana-data/`

## Code Style

- TypeScript with `strict: false` (consider enabling for better type safety)
- ESM modules (`"type": "module"` in package.json)
- Uses `.js` extensions in imports for ESM compatibility
- Prettier runs on pre-commit via lint-staged
- ESLint with typescript-eslint type-checked rules

## Important Notes

- **Migration workflow**: Always use migrations in non-dev environments. Generate migrations with entity changes, never rely on `synchronize: true`
- **Repository pattern**: When adding entities, update `AppDataSource.entities` array and create corresponding repository
- **TypeORM injection**: In tests, override static repository properties (e.g., `UserRepository.userRep`) to use test DataSource
- **Graceful shutdown**: Server waits for active connections before closing on SIGTERM/SIGINT
- **Security**: Helmet, rate limiting, and speed limiting are enabled by default

# Webkit AI Coding Instructions

## Project Overview

**Webkit** is a minimal Express + TypeORM + PostgreSQL REST API starter with integrated observability (Loki logging, Grafana dashboards). The architecture enforces separation of concerns through controllers → services → repositories pattern.

## Architecture & Core Patterns

### Layered Architecture

- **Controllers** (`src/controllers/*`): Handle HTTP requests, validate input using `class-validator`, call services
- **Services** (`src/services/*`): Business logic layer with no HTTP knowledge, delegates to repositories
- **Repositories** (`src/repositories/*`): Direct database access via TypeORM, error conversion to `AppError`
- **Routes** (`src/routes/*`): Router registration with middleware chains; prefix-based organization

**Key Pattern**: Always follow Controller → Service → Repository flow. Never skip layers or access repositories directly from controllers.

### Error Handling

- Custom `AppError` class (`src/sharable/AppError.ts`) with statusCode, code (enum), and isOperational flag
- Error codes defined in `src/sharable/jsend/ErrorCodes`
- Centralized error handler (`src/handlers/errorHandler.ts`) catches `AppError` and unknown errors
- Repository layer converts database errors (e.g., `QueryFailedError` for duplicates) to `AppError` with appropriate codes

**Example**: `throw new AppError(409, ErrorCodes.DUPLICATE_DATA, e.message)`

### Database & Migrations

- **DataSource**: `src/integrations/postgress/data-source.ts` (typo: postgress, not postgres)
- **Entities**: Currently only `User` (`src/entity/User.ts`) with decorators for columns and validation
- **Workflow**: `npm run migration:generate -- src/migration/<Name>` → review → `npm run migration:run`
- Never set `DB_SYNCHRONIZE=true` outside development; use migrations for all schema changes

### Configuration

- Centralized via `src/integrations/config.ts` using Zod schema validation
- Loads base `.env` then `.env.{NODE_ENV}` (environment-specific overrides)
- `NODE_ENV` supports: `local`, `development`, `production`, `test`
- All database and logging config comes from environment variables

### Logging & Observability

- Winston logger (`src/integrations/logger.ts`) supports console output and Loki shipping
- Request/response logged via middleware (`src/middlewares/request|responseLogger.ts`)
- Loki integration enabled by `LOG_TO_LOKI` and `LOKI_HOST` env vars
- Grafana (port 3000) dashboards configured to visualize Loki logs

### Middleware Stack (in `src/app.ts` order)

1. `requestMiddleware` - logs incoming requests
2. `responseMiddleware` - logs outgoing responses
3. `helmet()` - security headers
4. `bodyParser.json()` - JSON parsing
5. Route-specific middleware (rate limit, validation) applied per route
6. `errorHandler` - global error catcher (MUST be last)

## Testing Strategy

### Test Organization

- **Unit tests**: `**/*.unit.test.ts` - fast, isolated, no DB
- **Integration tests**: `**/*.integ.test.ts` - use TestContainers PostgreSQL (see `src/integrations/testcontainer/setup.ts`)
- **E2E tests**: `**/*.e2e.test.ts` - full stack tests

Run with: `npm run test:unit`, `npm run test:integ`, or `npm test` (all)

### Test Setup

Integration tests spin up a Docker PostgreSQL container automatically via TestContainers; no manual setup needed.

## Development Workflows

### Local Development

```bash
# Terminal 1: Start PostgreSQL + Loki + Grafana
docker compose up -d

# Terminal 2: Run server with hot reload
npm run start:local

# Watch specific logs
docker compose logs -f db-webkit  # or loki, grafana
```

### Debugging

- Inspector mode: `npm run start:debug` (port 9210)
- CPU profiling: `npm run prof:cpu` (generates .cpuprofile for Chrome DevTools)
- Connect to `127.0.0.1:9210` in DevTools

### Database Management

```bash
npm run migration:generate -- src/migration/MyMigration  # auto-gen from entity changes
npm run migration:run      # apply pending migrations
npm run migration:revert   # undo last migration
npm run seed:users         # run seed script (src/scripts/seed-users.ts)
```

### PM2 Production Deployment

```bash
npm run pm2                # start with production config
npm run pm2:logs           # tail logs
npm run pm2:restart        # restart app
npm run pm2:delete         # stop all
```

## Code Style & Conventions

- **TypeScript strict=false** (as of tsconfig.json) - keep implicit any warnings minimal
- **Route organization**: Each major entity (User, Employee) gets its own route file and controller
- **Validation**: Use `class-validator` decorators on Entity/DTO classes, validate in controller before service call
- **Status codes**: Use standard HTTP codes (200, 201, 400, 404, 409, 422, 500)
- **Response format**: JSend-like with `SuccessResponse` and `ErrorResponse` wrappers (`src/sharable/jsend/`)

## External Integrations

- **PostgreSQL 16**: Main database; defaults to localhost:5432 via docker-compose
- **Loki**: Log aggregation (port 3100); optional if `LOG_TO_LOKI=false`
- **Grafana**: Visualization dashboard (port 3000, default user: admin/admin)
- **Winston**: Logging library with Loki transport plugin

## Key File References

| File/Folder                                 | Purpose                                                |
| ------------------------------------------- | ------------------------------------------------------ |
| `src/main.ts`                               | Bootstrap: init DB, check Loki health, start server    |
| `src/app.ts`                                | Express app setup with middleware & route registration |
| `src/server.ts`                             | HTTP server startup with graceful shutdown             |
| `src/integrations/postgress/data-source.ts` | TypeORM DataSource config                              |
| `src/sharable/AppError.ts`                  | Custom error class                                     |
| `src/handlers/errorHandler.ts`              | Global error middleware                                |
| `docker-compose.yml`                        | PostgreSQL, Loki, Grafana stack                        |
| `package.json`                              | Scripts for builds, tests, migrations, PM2             |

## Common Tasks

- **Add a new entity**: Create class in `src/entity/`, add to `AppDataSource.entities`, run migration generation
- **Add a new route**: Create controller, service, repository; register in route file; attach to app in `src/app.ts`
- **Fix a failing test**: Check if it's unit (no DB setup) or integ (TestContainers needed); run `npm test -- path/to/test`
- **Deploy to production**: `npm run build` → push Docker image → `npm run pm2` on target server

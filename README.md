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
- PM2 (Process Manager)
- RabbitMQ (Message Queue Consumer)
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

A ready-to-use `docker-compose.yml` file is provided.

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

The server listens on port `3002` by default (see `src/app.ts` if you changed it).

## PM2 (Process Manager)

PM2 is a production process manager for Node.js applications with a built-in load balancer. This project includes a pre-configured `ecosystem.config.cjs` file for easy deployment and process management.

### Prerequisites

Install PM2 globally:

```sh
npm install -g pm2
```

### Quick Start

Before using PM2, build the project:

```sh
npm run build
```

Start the application with PM2:

```sh
# Production environment
npm run pm2

# Local environment
npm run pm2:local

# Development environment
npm run pm2:dev
```

### PM2 Configuration

The `ecosystem.config.cjs` file configures PM2 with:

- **Cluster Mode**: Runs multiple instances (one per CPU core) for better performance
- **Max Memory Restart**: Automatically restarts if memory exceeds 512MB
- **Environment Variables**: Pre-configured for production, local, and development environments
- **Log Management**: Stores logs in `./logs/pm2-error.log` and `./logs/pm2-out.log`

### Available PM2 Commands

**Start Application:**

```sh
npm run pm2              # Start in production mode
npm run pm2:local        # Start in local mode
npm run pm2:dev          # Start in development mode
```

**Process Management:**

```sh
npm run pm2:stop         # Stop the application
npm run pm2:restart      # Restart the application
npm run pm2:delete       # Stop and remove from PM2
```

**Monitoring:**

```sh
npm run pm2:list         # List all PM2 processes
npm run pm2:logs         # Display real-time logs
npm run pm2:monitor      # Open PM2 monitoring dashboard
```

### Manual PM2 Commands

You can also use PM2 directly:

```sh
# Start with specific environment
pm2 start ecosystem.config.cjs --env production
pm2 start ecosystem.config.cjs --env local
pm2 start ecosystem.config.cjs --env development

# Monitor processes
pm2 status              # Show process status
pm2 logs webkit-app     # Show logs for webkit-app
pm2 monit               # Open monitoring dashboard

# Process management
pm2 reload webkit-app   # Reload with zero downtime
pm2 restart webkit-app  # Restart the application
pm2 stop webkit-app     # Stop the application
pm2 delete webkit-app   # Remove from PM2

# View detailed info
pm2 show webkit-app     # Show detailed process information
pm2 describe webkit-app # Alias for show
```

### Environment Variables by Mode

**Production (`--env production`):**

- `NODE_ENV=production`
- Uses your system's environment variables for database and other configs

**Local (`--env local`):**

- `NODE_ENV=local`
- `PORT=3002`
- Database: `localhost:5432/db-webkit`
- Loki logging enabled (`http://localhost:3100`)
- `DB_SYNCHRONIZE=true`

**Development (`--env development`):**

- `NODE_ENV=development`
- Same configuration as local mode

### PM2 Auto-Startup

To configure PM2 to start on system boot:

```sh
# Generate startup script
pm2 startup

# Save current process list
pm2 save

# Disable startup (if needed)
pm2 unstartup
```

### Log Management

PM2 logs are stored in:

- Error logs: `./logs/pm2-error.log`
- Output logs: `./logs/pm2-out.log`

View and manage logs:

```sh
pm2 logs                 # Stream all logs
pm2 logs webkit-app      # Stream logs for webkit-app
pm2 flush                # Clear all logs
pm2 reloadLogs           # Reload log configuration
```

### Performance Optimization

The cluster mode configuration automatically:

- Spawns one instance per CPU core (`instances: 'max'`)
- Load balances incoming requests across instances
- Provides zero-downtime reloads
- Restarts crashed processes automatically

### Troubleshooting PM2

**Application won't start:**

- Ensure you've run `npm run build` first
- Check logs: `npm run pm2:logs`
- Verify database is running: `docker compose ps`

**High memory usage:**

- Check PM2 status: `npm run pm2:list`
- Adjust `max_memory_restart` in `ecosystem.config.cjs` if needed
- Investigate memory leaks in application code

**PM2 command not found:**

- Install PM2 globally: `npm install -g pm2`
- Or use npx: `npx pm2 <command>`

## RabbitMQ (Message Queue Consumer)

The project includes optional RabbitMQ consumer integration for processing asynchronous messages from queues and exchanges.

### Quick Setup

1. **Start RabbitMQ** (included in docker-compose):

```sh
docker compose up -d rabbitmq
```

2. **Enable in your environment**:

```env
RABBITMQ_ENABLED=true
RABBITMQ_URL=amqp://admin:admin@localhost:5672
```

3. **Access Management UI**: http://localhost:15672
   - Username: `admin`
   - Password: `admin`

### RabbitMQ Configuration

Environment variables:

- `RABBITMQ_ENABLED` (`true` | `false`, default: `false`) - Enable/disable RabbitMQ integration
- `RABBITMQ_URL` (default: `amqp://admin:admin@localhost:5672`) - Connection URL

### Consumer Examples

The project includes example consumers in `src/services/rabbitmq-consumer-examples.ts`:

```typescript
// Consume from a simple queue
await rabbitMQConsumerService.consumeQueue('user.notifications', (message) => {
  console.log('Processing:', message)
})

// Consume from exchange with routing pattern
await rabbitMQConsumerService.consumeExchange(
  'events',
  'user.*', // matches user.created, user.updated, etc.
  'user-events-queue',
  (message) => {
    console.log('User event:', message)
  },
  'topic'
)
```

### Testing Message Consumption

**Via Management UI:**

1. Open http://localhost:15672
2. Go to **Queues** tab
3. Click on your queue (e.g., `user.notifications`)
4. Use **Publish message** section to send a test message

**Check Health Status:**

```sh
curl http://localhost:3002/ready
# Shows RabbitMQ connection status in response
```

For complete documentation, see [`docs/RABBITMQ.md`](docs/RABBITMQ.md).

**Note:** The server will start successfully even if RabbitMQ is unavailable. Set `RABBITMQ_ENABLED=false` if you don't need message queue functionality.

## Scripts

Defined in `package.json`:

- `npm run dev` / `npm start` — start the server with tsx: `tsx src/main.ts`
- `npm run build` — compile TypeScript to JavaScript via `tsc`
- `npm run migration:generate` — generate a migration from current model changes
- `npm run migration:run` — run pending migrations
- `npm run migration:revert` — revert the last migration

Migration workflow example:

```sh
# Create an empty migration file
npm run migration:create -- src/migration/MyMigration

# Generate migration from entity changes
npm run migration:generate -- src/migration/add-email

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Configuration (Environment Variables)

The TypeORM DataSource (src\integrations\data-source.ts) uses:

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `5432`)
- `DB_USER` (default: `user`)
- `DB_PASSWORD` (default: `password`)
- `DB_NAME` (default: `db-webkit`)
- `DB_LOGGING` (`true` | `false`, default: `false`)
- `DB_SYNCHRONIZE` (`true` | `false`, default: `false`)

RabbitMQ configuration:

- `RABBITMQ_ENABLED` (`true` | `false`, default: `false`)
- `RABBITMQ_URL` (default: `amqp://admin:admin@localhost:5672`)

Note: Keep `DB_SYNCHRONIZE=false` in non-development environments. Use migrations to manage schema.

npm run migration:generate -- src/migration/add-email

## Database and Migrations

- DataSource file: `src/integrations/data-source.ts`
- Entities: currently `src/entity/User.ts`
- Migrations directory: `src/migration/*.ts` (create this folder when generating migrations)

Typical flow (examples):

```sh
# Generate migration from entity changes
npm run migration:generate -- src/migration/<MigrationName>

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

If you prefer quick development without migrations, you can temporarily set `DB_SYNCHRONIZE=true` (not recommended for production) to let TypeORM auto-sync the schema based on entities.

## API

Base URL (default): `http://localhost:3002`

- GET `/` — returns a mock list of employees
  - Controller: `src/controllers/EmployController.ts`
  - Repository: `src/repositories/EmployeeRepository.ts`

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

```sh
curl http://localhost:3002/ready
```

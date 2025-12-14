import { z } from 'zod'
import * as dotenv from 'dotenv'
import * as path from 'path'

const env = process.env.NODE_ENV || 'local'
const rootEnvFile = '.env'
const envFile = `.env.${env}`

// Load environment variables in order: .env (base) then .env.{env} (overrides)
// Environment-specific files override base .env
dotenv.config({ path: path.resolve(process.cwd(), rootEnvFile) })
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test', 'local']),
  PORT: z.string().transform(Number).pipe(z.number().int().positive()),
  DB_HOST: z.string(),
  DB_PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive().max(65535)),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_LOGGING: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
  DB_SYNCHRONIZE: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
  LOG_TO_LOKI: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
  LOKI_HOST: z.string().url().optional(),
  RABBITMQ_ENABLED: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
  RABBITMQ_URL: z.string().optional(),
})

export type Config = z.infer<typeof configSchema>

const parseConfig = () => {
  try {
    const raw = {
      NODE_ENV: process.env.NODE_ENV ?? 'local',
      PORT: process.env.PORT ?? '3002',
      DB_HOST: process.env.DB_HOST ?? 'localhost',
      DB_PORT: process.env.DB_PORT ?? '5432',
      DB_USER: process.env.DB_USER ?? 'user',
      DB_PASSWORD: process.env.DB_PASSWORD ?? 'password',
      DB_NAME: process.env.DB_NAME ?? 'db-webkit',
      DB_LOGGING: process.env.DB_LOGGING ?? 'false',
      DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE ?? 'false',
      LOG_TO_LOKI: process.env.LOG_TO_LOKI ?? 'false',
      LOKI_HOST: process.env.LOKI_HOST,
      RABBITMQ_ENABLED: process.env.RABBITMQ_ENABLED ?? 'false',
      RABBITMQ_URL:
        process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672',
    }
    const variables = configSchema.parse(raw)

    console.log('Config:', variables)

    return variables
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment configuration:', error.issues)
      process.exit(1)
    }
    throw error
  }
}

export const config = parseConfig()

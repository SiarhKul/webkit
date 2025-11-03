import { z } from 'zod'
import dotenv from 'dotenv'
import path from 'path'

// Determine the environment
const env = process.env.NODE_ENV || 'local'
const rootEnvFile = '.env'
const envFile = `.env.${env}`

// Load environment variables in order: .env (base) then .env.{env} (overrides)
// Environment-specific files override base .env
dotenv.config({ path: path.resolve(process.cwd(), rootEnvFile) })
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

// Define the configuration schema
const configSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'local'])
    .default('development'),

  // Server Configuration
  PORT: z.string().transform(Number).pipe(z.number().int().positive()),

  // Database Configuration
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
  // Logging to Loki
  LOG_TO_LOKI: z
    .string()
    .default('false')
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
  LOKI_HOST: z.string().url().optional(),
})

// Parse and validate environment variables
const parseConfig = () => {
  try {
    const variables = configSchema.parse(process.env)
    return variables
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment configuration:')
      for (const err of error.issues) {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      }
      process.exit(1)
    }
    throw error
  }
}

// Export validated configuration
export const config = parseConfig()

// Export type for TypeScript
export type Config = z.infer<typeof configSchema>

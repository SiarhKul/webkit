import { z } from 'zod'
import dotenv from 'dotenv'
import path from 'path'

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
    .default('false')
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
  LOKI_HOST: z.string().url().optional(),
})

const parseConfig = () => {
  try {
    const variables = configSchema.parse(process.env)
    console.log('VARIABLES:', variables)
    return variables
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues)
      console.error('❌ Invalid environment configuration:')
      process.exit(1)
    }
    throw error
  }
}

export const config = parseConfig()

export type Config = z.infer<typeof configSchema>

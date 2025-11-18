import express, { type Application } from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'

import { userRouter } from './routes/user'
import { config } from './integrations/config'
import { errorHandler } from './handlers/errorHandler'
import { allController } from './controllers/AllController'
import { employeeRouter } from './routes/employee'
import { healthRouter } from './routes/health'
import { rateLimit } from 'express-rate-limit'
import slowDown from 'express-slow-down'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})

const down = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // Allow 5 requests per 15 minutes.
  delayMs: (hits) => hits * 100, // Add 100 ms of delay to every request after the 5th one.
})

const app: Application = express()

const port = config.PORT
const lokiHost = config.LOKI_HOST

app.use(helmet())
app.use(bodyParser.json())

app.use(healthRouter)
app.use(employeeRouter)
app.use(userRouter)
app.all(/.*/, allController)

app.use(errorHandler)

export { app, port, lokiHost }

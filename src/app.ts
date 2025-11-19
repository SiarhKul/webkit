import express, { type Application } from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'

import { userRouter } from './routes/user'
import { config } from './integrations/config'
import { errorHandler } from './handlers/errorHandler'
import { allController } from './controllers/AllController'
import { employeeRouter } from './routes/employee'
import { healthRouter } from './routes/health'
import { requestLogger } from './middlewares/requestLogger'

const app: Application = express()

const port = config.PORT
const lokiHost = config.LOKI_HOST

app.use(requestLogger)
app.use(helmet())
app.use(bodyParser.json())

app.use(healthRouter)
app.use(employeeRouter)
app.use(userRouter)
app.all(/.*/, allController)

app.use(errorHandler)

export { app, port, lokiHost }

import express, { type Application } from 'express'
import { employeeRouter } from './routes/employee'
import { userRouter } from './routes/user'
import bodyParser from 'body-parser'
import { errorHandler } from './handlers/errorHandler'

import { config } from './integrations/config'
import { allController } from './controllers/AllController'
import { healthRouter } from './routes/health'

const app: Application = express()
const port = config.PORT
const lokiHost = config.LOKI_HOST

app.use(bodyParser.json())

app.use(healthRouter)
app.use(employeeRouter)
app.use(userRouter)
app.all(/.*/, allController)

app.use(errorHandler)

export { app, port, lokiHost }

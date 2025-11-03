import express, { type Application } from 'express'
import { employeeRouter } from './routes/employee'
import { userRouter } from './routes/user'
import bodyParser from 'body-parser'
import { errorHandler } from './handlers/errorHandler'

import { config } from './integrations/config'

const app: Application = express()
const port = config.PORT

app.use(bodyParser.json())

app.use(employeeRouter)
app.use(userRouter)

app.use(errorHandler)

export { app, port }

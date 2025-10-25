import express, { type Application } from 'express'
import { employeeRouter } from './routes/employee'
import { userRouter } from './routes/user'

const app: Application = express()
const port = 3002

app.use(employeeRouter)
app.use(userRouter)

export { app, port }

import express, { type Application } from 'express'
import { employeeRouter } from './routes/employee.js'

const app: Application = express()
const port = 3002

app.use(employeeRouter)

export { app, port }

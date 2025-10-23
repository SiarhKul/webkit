import express, { type Application } from 'express'
import { employeeRouter } from './routes/employee.js'

const app: Application = express()
const port = 3001

app.use(employeeRouter)

app.listen(port, () => {
    console.log(`Listening port is ${port}`)
})

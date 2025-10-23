import 'reflect-metadata'
import express, { type Application } from 'express'
import { employeeRouter } from './routes/employee.js'
import { AppDataSource } from './data-source.js'

const app: Application = express()
const port = 3001

app.use(employeeRouter)

async function bootstrap() {
    try {
        await AppDataSource.initialize()
        console.log('Database initialized')

        app.listen(port, () => {
            console.log(`Listening port is ${port}`)
        })
    } catch (err) {
        console.error('Failed to initialize database', err)
        process.exit(1)
    }
}

bootstrap()

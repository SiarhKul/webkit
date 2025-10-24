import 'reflect-metadata'
import { app, port } from './app'

import { AppDataSource } from './integrations/data-source'

async function bootstrap() {
    try {
        app.listen(port, () => {
            console.log(`Listening port is ${port}`)
        })
        await AppDataSource.initialize()
        console.log('Database initialized')
    } catch (err) {
        console.error('Failed to initialize database', err)
        process.exit(1)
    }
}

bootstrap()

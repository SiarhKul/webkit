import 'reflect-metadata'
import { app, port } from './app'
import logger from './integrations/logger'

import { AppDataSource } from './integrations/data-source'

async function bootstrap() {
  try {
    app.listen(port, () => {
      logger.info(`Listening port is ${port}`)
    })
    await AppDataSource.initialize()
    logger.info('Database initialized')
  } catch (err) {
    logger.error('Failed to initialize database', err)
    process.exit(1)
  }
}

bootstrap()

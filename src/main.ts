import 'reflect-metadata'
import './integrations/config'
import { Server } from 'http'
import { app, port, lokiHost } from './app'
import logger from './integrations/logger'

import { AppDataSource } from './integrations/data-source'
import { setupGracefulShutdown } from './utils/graceful-shutdown'

async function bootstrap(): Promise<Server> {
  try {
    await AppDataSource.initialize()
    logger.info('Database initialized')

    const res = await fetch(`${lokiHost}/ready`)
    if (res.ok) {
      logger.info('Grafana-Loki initialized %o', res)
    } else {
      logger.error('Failed to initialize Grafana-Loki')
      throw new Error('Failed to initialize Grafana-Loki')
    }

    const server = app.listen(port, () => {
      logger.info(`Server listening on port ${port}`)
    })
    return server
  } catch (err) {
    logger.error('Failed to initialize:', err)
    process.exit(1)
  }
}

await bootstrap().then((server) => {
  setupGracefulShutdown(server)
})

//todo:done: setupGracefulShutdown
//todo:done: unit, integration tests
//todo:done: /health
//todo:done helmet
//todo:done express-rate-limit.
//todo:done express-slow-down(throttle)
//todo:done  Log level (e.g., info, warn, error) descriptive message (e.g., request ID, user ID, IP address)
//todo:done Node.js Inspector with Chrome DevTools.
//todo:done request/response logs

//todo: profiler
//todo: Add CI/CD Lint -> Test -> Build -> Push Docker Image
//todo: Nginx
//todo: AWS Secrets Manager
//todo: Migration one column
//todo:  PM2
//todo: kafka or rebitMQ
//todo: auth and RBAC (Role-Based Access Control)

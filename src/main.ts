import 'reflect-metadata'
import './integrations/config'
import { startServer } from './server'
import { initializeDatabase } from './integrations/postgress/database'
import { checkLokiHealth } from './integrations/loki'
import { rabbitMQService } from './integrations/rabbitmq/rabbitmq.service'
import { initializeRabbitMQConsumers } from './services/RabbitMQConsumerService'
import logger from './integrations/logger'

async function bootstrap(): Promise<void> {
  try {
    await initializeDatabase()

    const lokiOk = await checkLokiHealth()
    if (!lokiOk) {
      process.exit(1)
    }

    await rabbitMQService.initialize()

    await initializeRabbitMQConsumers()

    startServer()
  } catch (err) {
    logger.error('Failed to initialize:', err)
    process.exit(1)
  }
}

await bootstrap().then(() => logger.info('Server is started'))

//todo:done: setupGracefulShutdown
//todo:done: unit, integration tests
//todo:done: /health
//todo:done helmet
//todo:done express-rate-limit.
//todo:done express-slow-down(throttle)
//todo:done  Log level (e.g., info, warn, error) descriptive message (e.g., request ID, user ID, IP address)
//todo:done Node.js Inspector with Chrome DevTools.
//todo:done request/response logs
//todo:done Update 5000000 records in thd DB. Use bunch update
//todo:done Add CI/CD Lint -> Test -> Build -> Push Docker Image
//todo: profiler
//todo: Nginx
//todo: AWS Secrets Manager
//todo: PM2
//todo: kafka or rebitMQ
//todo: auth and RBAC (Role-Based Access Control)
//todd: docker hot reload code changes

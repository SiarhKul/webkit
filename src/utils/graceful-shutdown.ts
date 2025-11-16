import { Server } from 'http'
import { AppDataSource } from '../integrations/data-source'
import logger from '../integrations/logger'

const SHUTDOWN_TIMEOUT = 30000 // 30 seconds

let isShuttingDown = false

async function gracefulShutdown(signal: string, server: Server): Promise<void> {
  if (isShuttingDown) {
    logger.warn('Shutdown already in progress, forcing exit...')
    process.exit(1)
  }

  isShuttingDown = true
  logger.info(`${signal} signal received: starting graceful shutdown...`)

  const forceShutdownTimer = setTimeout(() => {
    logger.error('Graceful shutdown timeout exceeded, forcing exit...')
    process.exit(1)
  }, SHUTDOWN_TIMEOUT)

  try {
    logger.info('Closing HTTP server...')
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          logger.error('Error closing HTTP server:', err)
          reject(err)
        } else {
          logger.info('HTTP server closed')
          resolve()
        }
      })
    })

    // Step 2: Close database connection
    if (AppDataSource.isInitialized) {
      logger.info('Closing database connection...')
      await AppDataSource.destroy()
      logger.info('Database connection closed')
    }

    clearTimeout(forceShutdownTimer)
    logger.info('Graceful shutdown completed')
    process.exit(0)
  } catch (err) {
    logger.error('Error during graceful shutdown:', err)
    clearTimeout(forceShutdownTimer)
    process.exit(1)
  }
}

export function setupGracefulShutdown(server: Server): void {
  process.on('SIGTERM', () => {
    void gracefulShutdown('SIGTERM', server)
  })
  process.on('SIGINT', () => {
    void gracefulShutdown('SIGINT', server)
  })

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error)
    void gracefulShutdown('uncaughtException', server)
  })

  process.on(
    'unhandledRejection',
    (reason: unknown, promise: Promise<unknown>) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
      void gracefulShutdown('unhandledRejection', server)
    }
  )
}

import { app } from './app'
import logger from './integrations/logger'
import { setupGracefulShutdown } from './utils/graceful-shutdown'
import { config } from './integrations/config'

export function startServer() {
  const port = config.PORT
  const server = app.listen(port, () => {
    logger.info(`Server listening on port ${port}`)
  })
  setupGracefulShutdown(server)
  return server
}

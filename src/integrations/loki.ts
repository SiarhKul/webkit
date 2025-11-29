import logger from './logger'
import { config } from './config'

export async function checkLokiHealth(): Promise<boolean> {
  const lokiHost = config.LOKI_HOST
  try {
    const res = await fetch(`${lokiHost}/ready`)
    if (res.ok) {
      logger.info('Grafana-Loki initialized')
      return true
    }
    logger.error('Failed to initialize Grafana-Loki, status: %s', res.status)
    return false
  } catch (error) {
    logger.error('Error checking Loki health: %o', error)
    return false
  }
}

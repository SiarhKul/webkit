import { AppDataSource } from './data-source'
import logger from '../logger'

export async function initializeDatabase(): Promise<void> {
  await AppDataSource.initialize()
  logger.info('Database initialized')
}

export default initializeDatabase

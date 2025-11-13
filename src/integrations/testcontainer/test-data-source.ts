import { DataSource } from 'typeorm'
import { setupTestDatabase } from './setup'

let cachedDataSource: DataSource | null = null

export async function getTestDataSource(): Promise<DataSource> {
  if (!cachedDataSource) {
    cachedDataSource = await setupTestDatabase()
  }
  return cachedDataSource
}

export async function resetTestDatabase(): Promise<void> {
  const dataSource = await getTestDataSource()
  if (dataSource.isInitialized) {
    const entities = dataSource.entityMetadatas
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name)
      await repository.clear()
    }
  }
}

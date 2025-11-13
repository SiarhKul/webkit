import { beforeAll, afterAll } from 'vitest'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { DataSource } from 'typeorm'
import { User } from '../../entity/User'

let container: StartedPostgreSqlContainer | null = null
let testDataSource: DataSource | null = null

export async function setupTestDatabase(): Promise<DataSource> {
  if (testDataSource?.isInitialized) {
    return testDataSource
  }

  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('test-db')
    .withUsername('test-user')
    .withPassword('test-password')
    .start()

  testDataSource = new DataSource({
    type: 'postgres',
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    synchronize: true,
    logging: false,
    entities: [User],
  })

  await testDataSource.initialize()
  return testDataSource
}

export async function teardownTestDatabase(): Promise<void> {
  if (testDataSource?.isInitialized) {
    await testDataSource.destroy()
    testDataSource = null
  }
  if (container) {
    await container.stop()
    container = null
  }
}

beforeAll(async () => {
  await setupTestDatabase()
})

afterAll(async () => {
  await teardownTestDatabase()
})

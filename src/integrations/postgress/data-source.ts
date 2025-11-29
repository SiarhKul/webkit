import { DataSource } from 'typeorm'
import { User } from '../../entity/User'
import { config } from '../config'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: config.DB_SYNCHRONIZE,
  logging: config.DB_LOGGING,
  entities: [User],
  migrations: ['src/migration/*.ts'],
  subscribers: [],
})

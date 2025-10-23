import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'

const {
    DB_HOST = 'localhost',
    DB_PORT = '5432',
    DB_USER = 'user',
    DB_PASSWORD = 'password',
    DB_NAME = 'db-webkit',
    DB_LOGGING = 'false',
    DB_SYNCHRONIZE = 'true',
} = process.env

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: DB_SYNCHRONIZE === 'true',
    logging: DB_LOGGING === 'true',
    entities: [User],
    migrations: [],
    subscribers: [],
})

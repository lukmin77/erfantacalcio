import 'reflect-metadata'
import { DataSource } from 'typeorm'
import 'dotenv/config'
import { NamingStrategy } from './server/db/utils/namingStrategy.js'

// Incremental migration: do NOT enable synchronize in production.
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  migrations: ['src/server/db/migrations/*.ts'],
  namingStrategy: new NamingStrategy(),
  entities: ['src/server/db/entities/*.ts'],
  synchronize: false,
  logging: false,
})

let initPromise: Promise<DataSource> | null = null
export function getDataSource() {
  if (!initPromise) {
    initPromise = AppDataSource.initialize()
  }
  return initPromise
}

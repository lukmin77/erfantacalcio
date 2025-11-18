import 'reflect-metadata'
import { DataSource } from 'typeorm'
import 'dotenv/config'
import { NamingStrategy } from '~/server/db/utils/namingStrategy'
import {
  AlboTrofeiNew,
  Calendario,
  Classifiche,
  Giocatori,
  Formazioni,
  FlowNewSeason,
  Trasferimenti,
  Tornei,
  Utenti,
  StatsP,
  StatsD,
  StatsC,
  StatsA,
  SquadreSerieA,
  SerieA,
  Partite,
  Migrations,
  Voti,
} from './server/db/entities'

// Incremental migration: do NOT enable synchronize in production.
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  migrations: ((): string[] => {
    const isDist = typeof import.meta !== 'undefined' && import.meta.url.includes('/dist/')
    if (isDist) return ['dist/server/db/migrations/*.js']
    return []
  })(),
  namingStrategy: new NamingStrategy(),
  entities: [
    AlboTrofeiNew,
    Calendario,
    Classifiche,
    Giocatori,
    Formazioni,
    FlowNewSeason,
    Trasferimenti,
    Tornei,
    Utenti,
    StatsP,
    StatsD,
    StatsC,
    StatsA,
    SquadreSerieA,
    SerieA,
    Partite,
    Migrations,
    Voti,
  ],
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  // logging: ['migration'],
  // logger: 'file',
})

// Persist DataSource and initialization promise across module reloads (Next.js HMR)
const globalRef = globalThis as unknown as { __appDataSource?: DataSource; __appDataSourcePromise?: Promise<DataSource> }
if (!globalRef.__appDataSource) globalRef.__appDataSource = AppDataSource

export function getDataSource() {
  if (!globalRef.__appDataSourcePromise) {
    globalRef.__appDataSourcePromise = globalRef.__appDataSource!.initialize()
  }
  return globalRef.__appDataSourcePromise
}

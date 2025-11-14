import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Utenti } from './entities/Utenti'
import { Calendario } from './entities/Calendario'
import { Tornei } from './entities/Tornei'
import { Partite } from './entities/Partite'
import { Formazioni } from './entities/Formazioni'
import { Giocatori } from './entities/Giocatori'
import { Trasferimenti } from './entities/Trasferimenti'
import { SquadreSerieA } from './entities/SquadreSerieA'
import { Classifiche } from './entities/Classifiche'
import { Voti } from './entities/Voti'

// Incremental migration: do NOT enable synchronize in production.
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    Utenti,
    Calendario,
    Tornei,
    Partite,
    Formazioni,
    Giocatori,
    Trasferimenti,
    SquadreSerieA,
    Classifiche,
    Voti,
  ],
  migrations: ['dist/server/db/migrations/*.js'],
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

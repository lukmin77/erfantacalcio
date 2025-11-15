import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Utenti } from './server/db/entities/Utenti.js'
import { Calendario } from './server/db/entities/Calendario.js'
import { Tornei } from './server/db/entities/Tornei.js'
import { Partite } from './server/db/entities/Partite.js'
import { Formazioni } from './server/db/entities/Formazioni.js'
import { Giocatori } from './server/db/entities/Giocatori.js'
import { Trasferimenti } from './server/db/entities/Trasferimenti.js'
import { SquadreSerieA } from './server/db/entities/SquadreSerieA.js'
import { Classifiche } from './server/db/entities/Classifiche.js'
import { Voti } from './server/db/entities/Voti.js'

// Incremental migration: do NOT enable synchronize in production.
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.DB_PORT),
  username: 'postgres',
  password: '11235',
  database: 'erfantacalcio',
  migrations: ['src/server/db/migrations/*.ts'],
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

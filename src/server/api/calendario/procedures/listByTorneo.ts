import { publicProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import { getCalendarioChampions, mapCalendario } from '../../../utils/common'

export const listByTorneoProcedure = publicProcedure.query(async () => {
  try {
    const result = await getCalendarioChampions()
    return await mapCalendario(result)
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

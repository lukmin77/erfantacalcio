import { publicProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import { getCalendario, mapCalendario } from '../../../utils/common'
import { IsNull, Not } from 'typeorm'

export const listByTorneoProcedure = publicProcedure.query(async () => {
  try {
    const result = await getCalendario({
      Tornei: { gruppoFase: Not(IsNull()) },
    })
    return await mapCalendario(result)
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

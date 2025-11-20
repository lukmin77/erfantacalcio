import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import Logger from '~/lib/logger.server'
import { getCalendario, mapCalendario } from '../../../utils/common'

export const getByIdCalendarioProcedure = publicProcedure
  .input(z.object({ idCalendario: z.number() }))
  .query(async ({ input }) => {
    try {
      const result = await getCalendario({ idCalendario: input.idCalendario })
      if (result) return mapCalendario(result)
      return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

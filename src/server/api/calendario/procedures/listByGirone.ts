import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { getCalendario, mapCalendario } from '../../../utils/common'

export const listByGironeProcedure = publicProcedure
  .input(z.number())
  .query(async (opts) => {
    try {
      const girone = opts.input
      const result = await getCalendario({ girone: girone })
      return await mapCalendario(result)
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

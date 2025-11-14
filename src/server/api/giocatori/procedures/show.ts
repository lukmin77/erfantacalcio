import Logger from '~/lib/logger.server'
import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import { getGiocatoreById } from '~/server/utils/common'

export const show = publicProcedure
  .input(
    z.object({
      idGiocatore: z.number(),
    }),
  )
  .query(async (opts) => {
    try {
      return await getGiocatoreById(+opts.input.idGiocatore)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

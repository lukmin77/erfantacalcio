import Logger from '~/lib/logger.server'
import { z } from 'zod'
import { publicProcedure } from '~/server/api/trpc'
import { getGiocatoriVenduti, getRosaDisponibile } from '../../../utils/common'

export const getRosaProcedure = publicProcedure
  .input(
    z.object({
      idSquadra: z.number(),
      includeVenduti: z.boolean(),
    }),
  )
  .query(async (opts) => {
    const { idSquadra, include } = {
      idSquadra: opts.input.idSquadra,
      include: opts.input.includeVenduti,
    }
    try {
      const rosaDisponibile = await getRosaDisponibile(idSquadra)
      if (include) {
        const giocatoriVenduti = await getGiocatoriVenduti(idSquadra)
        return [...rosaDisponibile, ...giocatoriVenduti]
      }
      return rosaDisponibile
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

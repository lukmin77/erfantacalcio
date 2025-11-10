import { publicProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import { getProssimaGiornata, getProssimaGiornataSerieA } from '../../common'

export const getProssimeGiornateProcedure = publicProcedure.query(
  async () => {
    try {
      const giornataSerieA = await getProssimaGiornataSerieA(false, 'asc')
      return await getProssimaGiornata(giornataSerieA)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  },
)

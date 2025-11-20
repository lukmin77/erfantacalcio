import { publicProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import { getCalendario, getProssimaGiornataSerieA, mapCalendario } from '../../../utils/common'

export const getUltimiRisultatiProcedure = publicProcedure.query(
  async () => {
    try {
      const giornataSerieA = await getProssimaGiornataSerieA(true, 'desc')
      const result = await getCalendario({ giornataSerieA })
      return await mapCalendario(result)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  },
)

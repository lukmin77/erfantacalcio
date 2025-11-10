import Logger from '~/lib/logger.server'
import { getTornei } from '../../../utils/common'
import { publicProcedure } from '~/server/api/trpc'

export const listTorneiProcedure = publicProcedure.query(async () => {
  try {
    return await getTornei()
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

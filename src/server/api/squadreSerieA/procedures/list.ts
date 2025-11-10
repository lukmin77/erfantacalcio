import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'

export const listSquadreSerieAProcedure = publicProcedure.query(async () => {
  try {
    return await prisma.squadreSerieA.findMany({
      select: { idSquadraSerieA: true, nome: true, maglia: true },
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

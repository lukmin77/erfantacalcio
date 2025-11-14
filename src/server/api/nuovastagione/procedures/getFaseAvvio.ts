import { adminProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'

export const getFaseAvvioProcedure = adminProcedure.query(async () => {
  try {
    const fase = await prisma.flowNewSeasosn.findFirst({
      where: { active: false },
      orderBy: { idFase: 'asc' },
    })
    return fase ? fase.idFase : 6
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

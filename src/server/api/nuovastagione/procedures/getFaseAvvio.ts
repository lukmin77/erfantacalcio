import { adminProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import { FlowNewSeason } from '~/server/db/entities'

export const getFaseAvvioProcedure = adminProcedure.query(async () => {
  try {
    const fase = await FlowNewSeason.findOne({
      where: { active: false },
      order: { idFase: 'ASC' },
    })
    return fase ? fase.idFase : 6
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

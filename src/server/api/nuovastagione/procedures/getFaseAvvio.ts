import { adminProcedure } from '~/server/api/trpc'
import { FlowNewSeason } from '~/server/db/entities'

export const getFaseAvvioProcedure = adminProcedure.query(async () => {
  try {
    const fase = await FlowNewSeason.findOne({
      where: { active: false },
      order: { idFase: 'ASC' },
    })
    return fase ? fase.idFase : 6
  } catch (error) {
    console.error('Si è verificato un errore', error)
    throw error
  }
})

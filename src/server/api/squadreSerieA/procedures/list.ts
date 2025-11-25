import { publicProcedure } from '~/server/api/trpc'
import { SquadreSerieA } from '~/server/db/entities'

export const listSquadreSerieAProcedure = publicProcedure.query(async () => {
  try {
    return await SquadreSerieA.find({
      select: { idSquadraSerieA: true, nome: true, maglia: true },
    })
  } catch (error) {
    console.error('Si è verificato un errore', error)
    throw error
  }
})

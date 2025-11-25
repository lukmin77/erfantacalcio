import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { getCalendario, mapCalendario } from '../../../utils/common'

export const listPartiteBySquadraProcedure = publicProcedure
  .input(z.object({ idSquadra: z.number() }))
  .query(async (opts) => {
    const idUtente = +opts.input.idSquadra
    try {
      const result = await getCalendario([
        { Partite: { idSquadraH: idUtente } },
        { Partite: { idSquadraA: idUtente } },
      ])
      return await mapCalendario(result)
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

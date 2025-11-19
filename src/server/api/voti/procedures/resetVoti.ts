import Logger from '~/lib/logger.server'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import { Voti } from '~/server/db/entities'

export const resetVotiProcedure = adminProcedure
  .input(
    z.object({
      idCalendario: z.number(),
    }),
  )
  .mutation(async (opts) => {
    try {
      await resetVoti(opts.input.idCalendario)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

async function resetVoti(idCalendario: number) {
  try {
    await Voti.update(
      {
        idCalendario: idCalendario,
      },
      {
        voto: 0,
        ammonizione: 0,
        espulsione: 0,
        gol: 0,
        assist: 0,
        autogol: 0,
        altriBonus: 0,
      },
    )
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

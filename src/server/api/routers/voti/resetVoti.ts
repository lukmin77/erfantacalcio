import Logger from '~/lib/logger.server'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import prisma from '~/utils/db'

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
    await prisma.voti.updateMany({
      where: {
        idCalendario: idCalendario,
      },
      data: {
        voto: 0,
        ammonizione: 0,
        espulsione: 0,
        gol: 0,
        assist: 0,
        autogol: 0,
        altriBonus: 0,
      },
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}
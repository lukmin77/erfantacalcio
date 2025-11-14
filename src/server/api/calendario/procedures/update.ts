import { adminProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'

export const updateCalendarioProcedure = adminProcedure
  .input(
    z.object({
      id: z.number(),
      idTorneo: z.number(),
      giornata: z.number(),
      giornataSerieA: z.number(),
      girone: z.number().optional().nullable(),
      data: z.string().datetime().optional().nullable(),
      dataFine: z.string().datetime().optional().nullable(),
      isRecupero: z.boolean(),
      isSovrapposta: z.boolean(),
    }),
  )
  .mutation(async (opts) => {
    try {
      const calendario = await prisma.calendario.update({
        where: { idCalendario: opts.input.id },
        data: {
          idTorneo: opts.input.idTorneo,
          giornata: opts.input.giornata,
          giornataSerieA: opts.input.giornataSerieA,
          girone: opts.input.girone,
          hasDaRecuperare: opts.input.isRecupero,
          hasSovrapposta: opts.input.isSovrapposta,
          data: opts.input.data,
          dataFine: opts.input.dataFine,
        },
      })
      return calendario.idCalendario
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

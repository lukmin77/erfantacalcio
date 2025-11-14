import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { protectedProcedure } from '~/server/api/trpc'
import { z } from 'zod'

export const updateMagliaProcedure = protectedProcedure
  .input(
    z.object({
      mainColor: z.string(),
      secondaryColor: z.string(),
      thirdColor: z.string(),
      textColor: z.string(),
      shirtNumber: z.number(),
      selectedTemplate: z.string(),
    }),
  )
  .mutation(async (opts) => {
    try {
      await prisma.utenti.updateMany({
        where: { idUtente: opts.ctx.session.user.idSquadra },
        data: { maglia: JSON.stringify(opts.input) },
      })
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

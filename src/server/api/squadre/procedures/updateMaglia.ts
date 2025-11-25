import { protectedProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { Utenti } from '~/server/db/entities'

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
      await Utenti.update(
        { idUtente: opts.ctx.session.user.idSquadra },
        { maglia: JSON.stringify(opts.input) },
      )
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

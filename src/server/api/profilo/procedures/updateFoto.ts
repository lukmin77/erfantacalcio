import { z } from 'zod'
import { protectedProcedure } from '~/server/api/trpc'
import { Utenti } from '~/server/db/entities'

export const updateFotoProcedure = protectedProcedure
  .input(z.object({ fileName: z.string() }))
  .mutation(async (opts) => {
    try {
      const filePath = opts.input.fileName
      await Utenti.update(
        { idUtente: opts.ctx.session.user.idSquadra },
        { foto: filePath },
      )
      console.info(`Foto profilo utente aggiornata: ${filePath}`)
      return filePath
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

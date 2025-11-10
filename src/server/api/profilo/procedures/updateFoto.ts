import Logger from '~/lib/logger.server'
import { z } from 'zod'
import prisma from '~/utils/db'
import { protectedProcedure } from '~/server/api/trpc'

export const updateFotoProcedure = protectedProcedure
  .input(z.object({ fileName: z.string() }))
  .mutation(async (opts) => {
    try {
      const filePath = opts.input.fileName
      await prisma.utenti.update({ data: { foto: filePath }, where: { idUtente: opts.ctx.session.user.idSquadra } })
      Logger.info(`Foto profilo utente aggiornata: ${filePath}`)
      return filePath
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

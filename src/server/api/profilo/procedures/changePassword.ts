import Logger from '~/lib/logger.server'
import { z } from 'zod'
import { computeMD5Hash } from '~/utils/hashPassword'
import { protectedProcedure } from '~/server/api/trpc'
import { Utenti } from '~/server/db/entities'

export const changePasswordProcedure = protectedProcedure
  .input(
    z.object({
      id: z.number(),
      oldPassword: z.string(),
      newPassword: z.string(),
    }),
  )
  .mutation(async (opts) => {
    try {
      const user = await Utenti.findOne({
        select: { pwd: true },
        where: { idUtente: opts.input.id },
      })
      if (!user) throw new Error('Utente non trovato')

      const oldPasswordHash = computeMD5Hash(opts.input.oldPassword)
      if (oldPasswordHash !== user.pwd)
        throw new Error('La vecchia password non è corretta')

      await Utenti.update(
        { idUtente: opts.input.id },
        { pwd: computeMD5Hash(opts.input.newPassword) },
      )
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

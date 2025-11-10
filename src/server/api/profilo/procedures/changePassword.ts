import Logger from '~/lib/logger.server'
import { z } from 'zod'
import prisma from '~/utils/db'
import { computeMD5Hash } from '~/utils/hashPassword'
import { protectedProcedure } from '~/server/api/trpc'

export const changePasswordProcedure = protectedProcedure
  .input(z.object({ id: z.number(), oldPassword: z.string(), newPassword: z.string() }))
  .mutation(async (opts) => {
    try {
      const user = await prisma.utenti.findUnique({ where: { idUtente: opts.input.id } })
      if (!user) throw new Error('Utente non trovato')

      const oldPasswordHash = computeMD5Hash(opts.input.oldPassword)
      if (oldPasswordHash !== user.pwd) throw new Error('La vecchia password non è corretta')

      await prisma.utenti.update({ where: { idUtente: opts.input.id }, data: { pwd: computeMD5Hash(opts.input.newPassword) } })
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

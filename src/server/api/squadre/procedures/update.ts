import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { adminProcedure } from '~/server/api/trpc'
import { z } from 'zod'

export const updateSquadraProcedure = adminProcedure
  .input(
    z.object({
      id: z.number(),
      isAdmin: z.boolean(),
      isLockLevel: z.boolean(),
      presidente: z.string(),
      email: z.string(),
      squadra: z.string(),
      importoAnnuale: z.number(),
      importoMulte: z.number(),
      importoMercato: z.number(),
      fantamilioni: z.number(),
    }),
  )
  .mutation(async (opts) => {
    try {
      await prisma.utenti.updateMany({
        where: { idUtente: opts.input.id },
        data: {
          presidente: opts.input.presidente,
          mail: opts.input.email,
          nomeSquadra: opts.input.squadra,
          importoBase: opts.input.importoAnnuale,
          importoMulte: opts.input.importoMulte,
          importoMercato: opts.input.importoMercato,
          fantaMilioni: opts.input.fantamilioni,
          adminLevel: opts.input.isLockLevel ? true : opts.input.isAdmin,
        },
      })
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

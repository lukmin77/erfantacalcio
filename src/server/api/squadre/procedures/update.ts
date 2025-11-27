import { adminProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { Utenti } from '~/server/db/entities'

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
      await Utenti.update(
        { idUtente: opts.input.id },
        {
          presidente: opts.input.presidente,
          mail: opts.input.email,
          nomeSquadra: opts.input.squadra,
          importoBase: opts.input.importoAnnuale,
          importoMulte: opts.input.importoMulte,
          importoMercato: opts.input.importoMercato,
          fantaMilioni: opts.input.fantamilioni,
          adminLevel: opts.input.isLockLevel ? true : opts.input.isAdmin,
        },
      )
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

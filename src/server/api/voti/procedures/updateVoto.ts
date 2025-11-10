import Logger from '~/lib/logger.server'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'

export const updateVotoProcedure = adminProcedure
  .input(
    z.object({
      idVoto: z.number(),
      ruolo: z.string(),
      voto: z.number(),
      ammonizione: z.number(),
      espulsione: z.number(),
      gol: z.number(),
      assist: z.number(),
      autogol: z.number(),
      altriBonus: z.number(),
    }),
  )
  .mutation(async (opts) => {
    try {
      const voto = await prisma.voti.update({
        where: {
          idVoto: opts.input.idVoto,
        },
        data: {
          voto: opts.input.voto,
          ammonizione: opts.input.ammonizione,
          espulsione: opts.input.espulsione,
          gol:
            opts.input.ruolo === 'P'
              ? opts.input.gol * Configurazione.bonusGolSubito
              : opts.input.gol * Configurazione.bonusGol,
          assist: opts.input.assist * Configurazione.bonusAssist,
          autogol: opts.input.autogol * Configurazione.bonusAutogol,
          altriBonus: opts.input.altriBonus,
        },
      })
      return voto.idVoto
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

import Logger from '~/lib/logger.server'
import { z } from 'zod'
import { adminProcedure } from '../../trpc'
import prisma from '~/utils/db'
import { normalizeNomeGiocatore } from '~/utils/helper'

export const createOrUpdatePlayer = adminProcedure
  .input(
    z.object({
      idGiocatore: z.number(),
      ruolo: z.string(),
      nome: z.string(),
      nomeFantagazzetta: z.string().nullable(),
    }),
  )
  .mutation(async (opts) => {
    try {
      const giocatore = await prisma.giocatori.upsert({
        where: {
          idGiocatore: opts.input.idGiocatore,
        },
        update: {
          nome: normalizeNomeGiocatore(opts.input.nome),
          nomeFantaGazzetta: opts.input.nomeFantagazzetta
            ? normalizeNomeGiocatore(opts.input.nomeFantagazzetta)
            : null,
          ruolo: opts.input.ruolo,
        },
        create: {
          nome: normalizeNomeGiocatore(opts.input.nome),
          nomeFantaGazzetta: opts.input.nomeFantagazzetta
            ? normalizeNomeGiocatore(opts.input.nomeFantagazzetta)
            : null,
          ruolo: opts.input.ruolo,
        },
      })
      return giocatore.idGiocatore
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

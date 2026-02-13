import { z } from 'zod'
import { adminProcedure } from '../../trpc'
import { normalizeNomeGiocatore } from '~/utils/helper'
import { Giocatori } from '~/server/db/entities'

export function isAbsoluteUrl(value?: string | null): boolean {
  if (!value) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

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
      const giocatore = await Giocatori.save({
        idGiocatore: opts.input.idGiocatore,
        nome: normalizeNomeGiocatore(opts.input.nome),
        nomeFantaGazzetta: opts.input.nomeFantagazzetta
          ? isAbsoluteUrl(opts.input.nomeFantagazzetta)
            ? opts.input.nomeFantagazzetta
            : normalizeNomeGiocatore(opts.input.nomeFantagazzetta)
          : null,
        ruolo: opts.input.ruolo,
      })
      return giocatore.idGiocatore
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

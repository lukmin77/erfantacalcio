import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'

export const getAlboProcedure = publicProcedure
  .input(
    z.object({
      idSquadra: z.number(),
    }),
  )
  .query(async (opts) => {
    try {
      const utente = await prisma.utenti.findUnique({
        where: { idUtente: opts.input.idSquadra },
      })
      if (utente) {
        return {
          squadra: utente.nomeSquadra,
          campionato: utente.Campionato,
          champions: utente.Champions,
          secondo: utente.Secondo,
          terzo: utente.Terzo,
        }
      }
      return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

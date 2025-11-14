import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'

export const getSquadraProcedure = publicProcedure
  .input(z.object({ idSquadra: z.number() }))
  .query(async (opts) => {
    const idUtente = +opts.input.idSquadra
    try {
      const utente = await prisma.utenti.findUnique({
        where: { idUtente },
      })
      if (utente) {
        return {
          id: utente.idUtente,
          isAdmin: utente.adminLevel,
          isLockLevel: utente.lockLevel,
            presidente: utente.presidente,
          email: utente.mail,
          squadra: utente.nomeSquadra,
          maglia: utente.maglia,
          foto: utente.foto,
          importoAnnuale: parseFloat(utente.importoBase.toFixed(2)),
          importoMulte: parseFloat(utente.importoMulte.toFixed(2)),
          importoMercato: parseFloat(utente.importoMercato.toFixed(2)),
          fantamilioni: parseFloat(utente.fantaMilioni.toFixed(2)),
        }
      }
      return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

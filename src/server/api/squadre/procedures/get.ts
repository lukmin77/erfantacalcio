import Logger from '~/lib/logger.server'
import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { Utenti } from '~/server/db/entities'

export const getSquadraProcedure = publicProcedure
  .input(z.object({ idSquadra: z.number() }))
  .query(async (opts) => {
    try {
      const utente = await Utenti.findOne({
        select: {
          idUtente: true,
          adminLevel: true,
          lockLevel: true,
          presidente: true,
          mail: true,
          nomeSquadra: true,
          maglia: true,
          foto: true,
          importoBase: true,
          importoMulte: true,
          importoMercato: true,
          fantaMilioni: true,
        },
        where: { idUtente: opts.input.idSquadra },
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
          importoAnnuale: utente.importoBase.toFixed(2),
          importoMulte: utente.importoMulte.toFixed(2),
          importoMercato: utente.importoMercato.toFixed(2),
          fantamilioni: utente.fantaMilioni.toFixed(2),
        }
      }
      return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

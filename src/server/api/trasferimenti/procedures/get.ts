import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'
import { number, z } from 'zod'

export const getTrasferimentoProcedure = publicProcedure
  .input(z.object({ idTrasferimento: number() }))
  .query(async (opts) => {
    const idTrasferimento = +opts.input.idTrasferimento
    try {
      const result = await prisma.trasferimenti.findUnique({
        select: {
          idTrasferimento: true,
          idGiocatore: true,
          costo: true,
          dataAcquisto: true,
          dataCessione: true,
          Utenti: { select: { idUtente: true } },
          SquadreSerieA: { select: { idSquadraSerieA: true } },
        },
        where: { idTrasferimento },
      })

      if (result) {
        return {
          idTrasferimento: result.idTrasferimento,
            idGiocatore: result.idGiocatore,
          idSquadra: result.Utenti?.idUtente ?? null,
          idSquadraSerieA: result.SquadreSerieA?.idSquadraSerieA ?? null,
          costo: result.costo,
          dataAcquisto: result.dataAcquisto,
          dataCessione: result.dataCessione,
        }
      }
      Logger.warn(`Trasferimento giocatore ${idTrasferimento} non trovato`)
      return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

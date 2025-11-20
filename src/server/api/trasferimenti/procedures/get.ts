import Logger from '~/lib/logger.server'
import { publicProcedure } from '~/server/api/trpc'
import { number, z } from 'zod'
import { Trasferimenti } from '~/server/db/entities'

export const getTrasferimentoProcedure = publicProcedure
  .input(z.object({ idTrasferimento: number() }))
  .query(async (opts) => {
    const idTrasferimento = +opts.input.idTrasferimento
    try {
      const result = await Trasferimenti.findOne({
        select: {
          idTrasferimento: true,
          idGiocatore: true,
          costo: true,
          dataAcquisto: true,
          dataCessione: true,
          idSquadraSerieA: true,
          idSquadra: true,
        },
        where: { idTrasferimento },
      })

      if (result) {
        return {
          idTrasferimento: result.idTrasferimento,
          idGiocatore: result.idGiocatore,
          idSquadra: result.idSquadra,
          idSquadraSerieA: result.idSquadraSerieA,
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

import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import Logger from '~/lib/logger.server'
import { mapCalendario } from '../../../utils/common'
import { Calendario } from '~/server/db/entities'

export const listPartiteBySquadraProcedure = publicProcedure
  .input(z.object({ idSquadra: z.number() }))
  .query(async (opts) => {
    const idUtente = +opts.input.idSquadra
    try {
      const result = await Calendario.find({
        select: {
          idCalendario: true,
          giornata: true,
          giornataSerieA: true,
          ordine: true,
          data: true,
          dataFine: true,
          hasSovrapposta: true,
          girone: true,
          hasGiocata: true,
          hasDaRecuperare: true,
          Tornei: { idTorneo: true, nome: true, gruppoFase: true },
          Partite: {
            idPartita: true,
            idSquadraH: true,
            idSquadraA: true,
            hasMultaH: true,
            hasMultaA: true,
            golH: true,
            golA: true,
            fattoreCasalingo: true,
            UtentiSquadraH: { nomeSquadra: true, foto: true, maglia: true },
            UtentiSquadraA: { nomeSquadra: true, foto: true, maglia: true },
          },
        },
        relations: {
          Tornei: true,
          Partite: { UtentiSquadraH: true, UtentiSquadraA: true },
        },
        where: [
          { Partite: { idSquadraH: idUtente } },
          { Partite: { idSquadraA: idUtente } },
        ],
        order: { ordine: 'asc', idTorneo: 'asc' },
      })
      return await mapCalendario(result)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import Logger from '~/lib/logger.server'
import { mapCalendario } from '../../../utils/common'
import { Calendario } from '~/server/db/entities'

export const getByIdCalendarioProcedure = publicProcedure
  .input(z.object({ idCalendario: z.number() }))
  .query(async ({ input }) => {
    try {
      const result = await Calendario.findOne({
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
              UtentiSquadraH: {  nomeSquadra: true, foto: true, maglia: true } ,
              UtentiSquadraA: {  nomeSquadra: true, foto: true, maglia: true } ,
          },
        },
        relations: { Tornei: true, Partite: { UtentiSquadraH: true, UtentiSquadraA: true } },
        where: { idCalendario: input.idCalendario },
      })
      if (result) return mapCalendario([result])
      return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

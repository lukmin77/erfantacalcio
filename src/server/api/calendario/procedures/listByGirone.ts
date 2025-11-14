import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { mapCalendario } from '../../../utils/common'

export const listByGironeProcedure = publicProcedure
  .input(z.number())
  .query(async (opts) => {
    try {
      const girone = opts.input
      const result = await prisma.calendario.findMany({
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
          Tornei: { select: { idTorneo: true, nome: true, gruppoFase: true } },
          Partite: {
            select: {
              idPartita: true,
              idSquadraH: true,
              idSquadraA: true,
              hasMultaH: true,
              hasMultaA: true,
              golH: true,
              golA: true,
              fattoreCasalingo: true,
              Utenti_Partite_idSquadraHToUtenti: { select: { nomeSquadra: true, foto: true, maglia: true } },
              Utenti_Partite_idSquadraAToUtenti: { select: { nomeSquadra: true, foto: true, maglia: true } },
            },
          },
        },
        where: { girone },
        orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }],
      })
      return await mapCalendario(result)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

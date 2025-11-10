import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { mapCalendario } from '../../common'

export const getByIdCalendarioProcedure = publicProcedure
  .input(z.object({ idCalendario: z.number() }))
  .query(async ({ input }) => {
    try {
      const result = await prisma.calendario.findUnique({
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
        where: { idCalendario: input.idCalendario },
      })
      if (result) return mapCalendario([result])
      return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

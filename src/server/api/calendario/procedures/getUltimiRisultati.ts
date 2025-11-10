import { publicProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { getProssimaGiornataSerieA, mapCalendario } from '../../../utils/common'

export const getUltimiRisultatiProcedure = publicProcedure.query(
  async () => {
    try {
      const giornataSerieA = await getProssimaGiornataSerieA(true, 'desc')
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
        where: { giornataSerieA },
        orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }],
      })
      return await mapCalendario(result)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  },
)

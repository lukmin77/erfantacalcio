import { publicProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { mapCalendario } from '../../common'

export const listAttualeProcedure = publicProcedure.query(async () => {
  try {
    const currentDateMinus = new Date()
    currentDateMinus.setDate(currentDateMinus.getDate() - 10)
    const currentDatePlus = new Date()
    currentDatePlus.setDate(currentDateMinus.getDate() + 10)
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
      where: {
        AND: [
          { girone: { gt: 0 } },
          { giornata: { gt: 0 } },
          { data: { gte: currentDateMinus } },
          { data: { lte: currentDatePlus } },
        ],
      },
      orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }],
    })
    return await mapCalendario(result)
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

import { publicProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import { mapCalendario } from '../../../utils/common'
import { Calendario } from '~/server/db/entities'
import { Between, MoreThan } from 'typeorm'

export const listAttualeProcedure = publicProcedure.query(async () => {
  try {
    const currentDateMinus = new Date()
    currentDateMinus.setDate(currentDateMinus.getDate() - 10)
    const currentDatePlus = new Date()
    currentDatePlus.setDate(currentDateMinus.getDate() + 10)
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
      relations: { Tornei: true, Partite: { UtentiSquadraH: true, UtentiSquadraA: true } },
      where: {
        girone: MoreThan(0),
        giornata: MoreThan(0),
        data: Between(currentDateMinus, currentDatePlus),
      },
      order: { ordine: 'asc' , idTorneo: 'asc' },
    })
    return await mapCalendario(result)
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

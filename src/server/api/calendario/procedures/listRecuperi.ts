import { publicProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import { mapCalendario } from '../../../utils/common'
import { Calendario } from '~/server/db/entities'

export const listRecuperiProcedure = publicProcedure.query(async () => {
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
      where: { hasDaRecuperare: true },
      order: { ordine: 'asc', idTorneo: 'asc' },
    })
    return await mapCalendario(result)
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

import Logger from '~/lib/logger.server'
import {
  getProssimaGiornata,
  getProssimaGiornataSerieA,
} from '~/server/utils/common'
import { protectedProcedure } from '../../trpc'

export const giornateDaGiocare = protectedProcedure.query(async (opts) => {
  try {
    const idSquadraUtente = opts.ctx.session.user.idSquadra
    const giornataSerieA = await getProssimaGiornataSerieA(false, 'asc')
    const prossimeGiornate = await getProssimaGiornata(giornataSerieA, true)
    const giornateFiltrate = prossimeGiornate.filter((giornata) =>
      giornata.partite.some(
        (partita) =>
          partita.idHome === idSquadraUtente ||
          partita.idAway === idSquadraUtente,
      ),
    )
    return giornateFiltrate
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

import { adminProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'
import { chiudiTrasferimentoGiocatore } from '../../../utils/common'
import { messageSchema } from '~/schemas/messageSchema'
import { checkVotiUltimaGiornata, updateFase } from '../services/helpers'
import { z } from 'zod'

export const chiudiStagioneProcedure = adminProcedure.mutation<z.infer<typeof messageSchema>>(async () => {
  try {
    const takeNum = 30
    Logger.info(`Chiudo la stagione ${Configurazione.stagione} con un massimo di ${takeNum} giocatori in trasferimento`)
    if ((await checkVotiUltimaGiornata()) === false) {
      Logger.warn('Impossibile chiudere la stagione, calendario non completato')
      return { isError: true, isComplete: true, message: 'Impossibile chiudere la stagione, calendario non completato' }
    } else {
      const giocatoritrasferimenti = await prisma.trasferimenti.findMany({
        select: { idGiocatore: true },
        distinct: ['idGiocatore'],
        where: { AND: [{ dataCessione: null }, { stagione: Configurazione.stagione }] },
        take: takeNum,
      })
      const countTrasferimenti = await prisma.trasferimenti.count({
        where: { AND: [{ dataCessione: null }, { stagione: Configurazione.stagione }] },
      })
      Logger.info(`Trovati ${giocatoritrasferimenti.length} giocatori in trasferimento da chiudere`)
      const promises = giocatoritrasferimenti.map(async (c) => {
        await chiudiTrasferimentoGiocatore(c.idGiocatore, true)
      })
      await Promise.all(promises)

      if (giocatoritrasferimenti.length < takeNum) {
        await updateFase(1)
        Logger.info(`Chiusura trasferimenti stagione ${Configurazione.stagione} completato`)
        return { isError: false, isComplete: true, message: `Chiusura trasferimenti stagione ${Configurazione.stagione} completato.` }
      } else {
        Logger.info(`Chiusura trasferimenti stagione ${Configurazione.stagione} ancora incompleto.`)
        return { isError: false, isComplete: false, message: `Chiusura trasferimenti stagione ${Configurazione.stagione} ancora incompleto. CONTINUA A CHIUDERE I TRASFERIMENTI (mancanti: ${countTrasferimenti})` }
      }
    }
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

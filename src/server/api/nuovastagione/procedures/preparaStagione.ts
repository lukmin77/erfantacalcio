import { adminProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'
import { messageSchema } from '~/schemas/schema'
import { checkVotiUltimaGiornata, checkVerificaPartiteGiocate, updateFase } from '../services/helpers'
import { toLocaleDateTime } from '~/utils/dateUtils'
import { z } from 'zod'

export const preparaStagioneProcedure = adminProcedure.mutation<z.infer<typeof messageSchema>>(async () => {
  try {
    if ((await checkVotiUltimaGiornata()) === false) {
      Logger.warn('Impossibile preparare la nuova stagione, calendario non completato')
      return { isError: true, isComplete: true, message: 'Impossibile preparare la nuova stagione, calendario non completato' }
    } else if ((await checkVerificaPartiteGiocate()) === false) {
      Logger.warn('Impossibile preparare la nuova stagione: ci sono ancora partite da giocare')
      return { isError: true, isComplete: true, message: 'Impossibile preparare la nuova stagione: ci sono ancora partite da giocare' }
    } else {
      await prisma.$transaction([
        prisma.classifiche.deleteMany(),
        prisma.voti.deleteMany(),
        prisma.formazioni.deleteMany(),
        prisma.partite.deleteMany(),
        prisma.calendario.updateMany({
          data: {
            hasGiocata: false,
            data: toLocaleDateTime(new Date()),
            dataFine: toLocaleDateTime(new Date()),
          },
        }),
      ])

      await updateFase(2)

      Logger.info(`Azzeramento dati della scorsa stagione ${Configurazione.stagione}`)
      return { isError: false, isComplete: true, message: `Azzeramento dati della scorsa stagione ${Configurazione.stagione}` }
    }
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

import { adminProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { messageSchema } from '~/schemas/messageSchema'
import { generateUniqueRandomNumbers } from '~/utils/numberUtils'
import { updateFase } from '../services/helpers'
import { toLocaleDateTime } from '~/utils/dateUtils'
import { z } from 'zod'

export const preparaIdSquadreProcedure = adminProcedure.mutation<z.infer<typeof messageSchema>>(async () => {
  try {
    const utenti = await prisma.utenti.findMany({ orderBy: { idUtente: 'asc' } })
    const startNewId = 10

    const promises = utenti.map(async (c) => {
      const newIdUtente = c.idUtente + startNewId
      const username = c.username + '_temp'

      await prisma.utenti.create({
        data: {
          idUtente: newIdUtente,
          username: username,
          pwd: c.pwd,
          adminLevel: c.adminLevel,
          presidente: c.presidente,
          mail: c.mail,
          nomeSquadra: c.nomeSquadra,
          foto: c.foto,
          importoBase: 120,
          importoMulte: 0,
          importoMercato: 0,
          fantaMilioni: 600,
          Campionato: c.Campionato,
          Champions: c.Champions,
          Secondo: c.Secondo,
          Terzo: c.Terzo,
          lockLevel: c.lockLevel,
          maglia: c.maglia,
        },
      })
    })
    await Promise.all(promises)
    Logger.info('creati nuovi utenti temporanei')

    const uniqueRandomNumbers = generateUniqueRandomNumbers(startNewId + 1, startNewId + 8, 8)
    Logger.info('sorteggiati nuovi idutente', uniqueRandomNumbers)

    for (let i = 0; i <= 7; i++) {
      const user = await prisma.utenti.findUnique({ where: { idUtente: uniqueRandomNumbers[i] } })
      await prisma.utenti.update({
        data: {
          username: `${user?.username.replace('_temp', '_new')}`,
          adminLevel: user?.adminLevel,
          lockLevel: user?.lockLevel,
          mail: user?.mail,
          nomeSquadra: user?.nomeSquadra,
          presidente: user?.presidente,
          foto: user?.foto,
          pwd: user?.pwd,
          Campionato: user?.Campionato,
          Champions: user?.Champions,
          fantaMilioni: user?.fantaMilioni,
          importoBase: user?.importoBase,
          importoMercato: user?.importoMercato,
          importoMulte: user?.importoMulte,
          Secondo: user?.Secondo,
          Terzo: user?.Terzo,
          maglia: user?.maglia,
        },
        where: { idUtente: i + 1 },
      })
      Logger.info(`aggiornato utente: ${i + 1} con utente estratto: ${uniqueRandomNumbers[i]}`)
    }

    await prisma.utenti.deleteMany({ where: { idUtente: { gt: 8 } } })
    Logger.info('eliminati utenti con idutente > 8')

    await prisma.$transaction([
      prisma.$executeRaw`UPDATE "Utenti" SET username=REPLACE(username, '_new', '');`,
    ])
    Logger.info('aggiornati usernames utenti')

    await updateFase(3)

    return { isError: false, isComplete: true, message: 'Sorteggio nuove squadre completato' }
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

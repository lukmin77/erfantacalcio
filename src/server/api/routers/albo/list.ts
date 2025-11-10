import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'

export const listAlboProcedure = publicProcedure.query(async () => {
  try {
    const records = await prisma.alboTrofei_new.findMany({
      orderBy: [
        { stagione: 'desc' },
        { campionato: 'desc' },
        { champions: 'desc' },
        { secondo: 'desc' },
        { terzo: 'desc' },
      ],
    })
    return records.map((c) => ({
      id: c.id,
      stagione: c.stagione,
      campionato: c.campionato,
      champions: c.champions,
      secondo: c.secondo,
      terzo: c.terzo,
    }))
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

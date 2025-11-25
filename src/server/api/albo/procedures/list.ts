import { publicProcedure } from '~/server/api/trpc'
import { AlboTrofei } from '~/server/db/entities'

export const listAlboProcedure = publicProcedure.query(async () => {
  try {
    const records = await AlboTrofei.find({
      order: {
        stagione: 'DESC',
        campionato: 'DESC',
        champions: 'DESC',
        secondo: 'DESC',
        terzo: 'DESC',
      },
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
    console.error('Si è verificato un errore', error)
    throw error
  }
})

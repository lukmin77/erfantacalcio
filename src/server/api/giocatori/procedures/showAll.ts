import { publicProcedure } from '../../trpc'
import { getRuoloEsteso } from '~/utils/helper'
import { Giocatori } from '~/server/db/entities'

export const showAll = publicProcedure.query(async () => {
  try {
    const giocatori = await Giocatori.find({
      select: {
        idGiocatore: true,
        nome: true,
        ruolo: true,
      },
      order: { nome: 'asc' },
    })

    if (giocatori) {
      return giocatori.map((giocatore) => ({
        id: giocatore.idGiocatore,
        label: `${giocatore.nome} - ${getRuoloEsteso(giocatore.ruolo)}`,
      }))
    }
  } catch (error) {
    console.error('Si è verificato un errore', error)
    throw error
  }
})

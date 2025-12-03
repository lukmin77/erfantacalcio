import { z } from 'zod'
import { adminProcedure } from '../../trpc'
import _ from 'lodash'
import {
  Calendario,
} from '~/server/db/entities'

export const checkFormazioniProcedure = adminProcedure
  .input(
    z.object({
      idCalendario: z.number()
    }),
  )
  .mutation(async (opts) => {
    try {
      console.log(`Processing check for formations in calendario ${opts.input.idCalendario}`)

      const calendario = await Calendario.findOneOrFail(
        { select: {
          idCalendario: true,
          Partite: {
            idPartita: true,
            Formazioni: {
              idFormazione: true,
            },
          }
        },
        relations: {
          Partite: {
            Formazioni: true,
          },
        },
        where: { idCalendario: opts.input.idCalendario },
      })
      
      if (calendario.Partite.length !== calendario.Partite.filter(p => p.Formazioni.length > 0).length){
        console.warn(`Attenzione: non tutte le partite della giornata ${opts.input.idCalendario} hanno formazioni inserite.`)
        return false
      }
      return true
      
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })


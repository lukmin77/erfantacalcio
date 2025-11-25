import { z } from 'zod'
import { publicProcedure } from '~/server/api/trpc'
import { RuoloUtente } from '~/utils/enums'
import {
  getTorneo,
  getDescrizioneGiornata,
  getTorneoTitle,
  getTorneoSubTitle,
  getCalendario,
} from '../../../utils/common'
import { mapPartite } from '../services/partiteMapping'
import _ from 'lodash'

export const getGiornataPartiteProcedure = publicProcedure
  .input(
    z.object({
      idCalendario: z.number(),
      includeTabellini: z.boolean(),
      backOfficeMode: z.boolean(),
    }),
  )
  .query(async (opts) => {
    try {
      const result = await getCalendario({
        idCalendario: opts.input.idCalendario,
      })
      const calendario = result.pop()
      if (calendario) {
        return {
          idCalendario: calendario.idCalendario,
          idTorneo: calendario.Torneo.idTorneo,
          giornata: calendario.giornata,
          giornataSerieA: calendario.giornataSerieA,
          isGiocata: calendario.hasGiocata,
          isSovrapposta: calendario.hasSovrapposta,
          data: calendario.data?.toISOString(),
          dataFine: calendario.dataFine?.toISOString(),
          girone: calendario.girone,
          partite: await mapPartite(
            calendario.Partite,
            opts.input.includeTabellini,
            opts.ctx.session?.user?.ruolo === RuoloUtente.contributor
              ? false
              : opts.input.backOfficeMode,
          ),
          Torneo: getTorneo(
            calendario.Torneo.nome,
            calendario.Torneo.gruppoFase,
          ),
          Descrizione: getDescrizioneGiornata(
            calendario.Torneo.nome,
            calendario.giornata,
            calendario.giornataSerieA,
            calendario.Torneo.gruppoFase,
          ),
          Title: getTorneoTitle(
            calendario.Torneo.nome,
            calendario.giornata,
            calendario.Torneo.gruppoFase,
          ),
          SubTitle: getTorneoSubTitle(calendario.giornataSerieA),
        }
      }
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

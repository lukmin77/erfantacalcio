import Logger from '~/lib/logger.server'
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
          idTorneo: calendario.Tornei.idTorneo,
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
            calendario.Tornei.nome,
            calendario.Tornei.gruppoFase,
          ),
          Descrizione: getDescrizioneGiornata(
            calendario.Tornei.nome,
            calendario.giornata,
            calendario.giornataSerieA,
            calendario.Tornei.gruppoFase,
          ),
          Title: getTorneoTitle(
            calendario.Tornei.nome,
            calendario.giornata,
            calendario.Tornei.gruppoFase,
          ),
          SubTitle: getTorneoSubTitle(calendario.giornataSerieA),
        }
      }
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

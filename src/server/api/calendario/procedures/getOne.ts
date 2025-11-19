import { adminProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import Logger from '~/lib/logger.server'
import { calendarioSchema } from '~/schemas/calendario'
import { Calendario } from '~/server/db/entities'

function mapCalendarioResult(result: any): z.infer<typeof calendarioSchema> {
  return {
    id: result.idCalendario,
    idTorneo: result.Tornei.idTorneo,
    nome: result.Tornei.nome,
    gruppoFase: result.Tornei.gruppoFase,
    giornata: result.giornata,
    giornataSerieA: result.giornataSerieA,
    isGiocata: result.hasGiocata,
    isSovrapposta: result.hasSovrapposta,
    isRecupero: result.hasDaRecuperare,
    data: result.data?.toISOString(),
    dataFine: result.dataFine?.toISOString(),
    girone: result.girone,
    isSelected: false,
  }
}

export const getOneCalendarioProcedure = adminProcedure
  .input(z.object({ idCalendario: z.number() }))
  .query(async (opts) => {
    try {
      const result = await Calendario.findOne({
        select: {
          idCalendario: true,
          giornata: true,
          giornataSerieA: true,
          ordine: true,
          data: true,
          dataFine: true,
          hasSovrapposta: true,
          girone: true,
          hasGiocata: true,
          hasDaRecuperare: true,
          Tornei: { idTorneo: true, nome: true, gruppoFase: true },
        },
        relations: { Tornei: true },
        where: { idCalendario: opts.input.idCalendario },
      })
      if (result) {
        return mapCalendarioResult(result)
      }
      return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

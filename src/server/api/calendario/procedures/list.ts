import { adminProcedure } from '~/server/api/trpc'
import { calendarioSchema } from '~/schemas/calendario'
import { z } from 'zod'
import { getCalendario } from '~/server/utils/common'


export const listCalendarioProcedure = adminProcedure.query(async () => {
  try {
    const result = await getCalendario({})

    const indexSelected = result.findIndex((item) => !item.hasGiocata)
    const mapped = result.map((c, index) => ({
        id: c.idCalendario,
        idTorneo: c.Torneo.idTorneo,
        nome: c.Torneo.nome,
        gruppoFase: c.Torneo.gruppoFase,
        giornata: c.giornata,
        giornataSerieA: c.giornataSerieA,
        isGiocata: c.hasGiocata,
        isSovrapposta: c.hasSovrapposta,
        isRecupero: c.hasDaRecuperare,
        data: c.data?.toISOString(),
        dataFine: c.dataFine?.toISOString(),
        girone: c.girone,
        isSelected: index === indexSelected,
      }))
    const parsed = z.array(calendarioSchema).parse(mapped)
    return parsed
  } catch (error) {
    console.error('Si è verificato un errore', error)
    throw error
  }
})

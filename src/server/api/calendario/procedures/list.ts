import { adminProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { calendarioSchema } from '~/schemas/calendario'
import { z } from 'zod'



export const listCalendarioProcedure = adminProcedure.query(async () => {
  try {
    const result = await prisma.calendario.findMany({
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
        Tornei: { select: { idTorneo: true, nome: true, gruppoFase: true } },
      },
      orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }],
    })

    const indexSelected = result.findIndex((item) => !item.hasGiocata)
    const mapped = result.map((c, index) => ({
        id: c.idCalendario,
        idTorneo: c.Tornei.idTorneo,
        nome: c.Tornei.nome,
        gruppoFase: c.Tornei.gruppoFase,
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
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

import Logger from '~/lib/logger.server'
import { adminProcedure } from '../trpc'
import { z } from 'zod'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'
import { VotiDistinctItem } from '~/types/voti'

export const showStatisticaVotiProcedure = adminProcedure
  .input(
    z.object({
      idGiocatore: z.number(),
      top: z.number().nullable().optional(),
    }),
  )
  .query(async (opts) => {
    try {
      const result = await prisma.voti.findMany({
        where: {
          idGiocatore: opts.input.idGiocatore,
          voto: { gt: 0 },
        },
        select: {
          idVoto: true,
          voto: true,
          ammonizione: true,
          espulsione: true,
          gol: true,
          assist: true,
          autogol: true,
          altriBonus: true,
          titolare: true,
          riserva: true,
          Giocatori: {
            select: { nome: true, ruolo: true },
          },
          Calendario: {
            select: {
              giornataSerieA: true,
              Tornei: { select: { nome: true, gruppoFase: true } },
            },
          },
        },
        orderBy: {
          Calendario: {
            giornataSerieA: 'asc',
          },
        },
        take: opts.input.top ? opts.input.top : 1000,
      })

      if (result !== null) {
        const voti = result.reduce((acc, c) => {
          const giornata = c.Calendario.giornataSerieA
          if (!acc.has(giornata)) {
            acc.set(giornata, {
              voto: c.voto?.toNumber() ?? null,
              ammonizione: c.ammonizione.toNumber() ?? null,
              espulsione: c.espulsione.toNumber() ?? null,
              gol:
                c.Giocatori.ruolo === 'P'
                  ? (c.gol?.toNumber() ?? 0) / Configurazione.bonusGolSubito
                  : (c.gol?.toNumber() ?? 0) / Configurazione.bonusGol,
              assist: (c.assist?.toNumber() ?? 0) / Configurazione.bonusAssist,
              giornataSerieA: giornata,
            })
          }
          return acc
        }, new Map())

        const votiDistinct: VotiDistinctItem[] = Array.from(
          voti.values(),
        ) as VotiDistinctItem[]

        return votiDistinct
      } else return []
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

import Logger from '~/lib/logger.server'
import { publicProcedure } from '../trpc'
import { z } from 'zod'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'

export const listVotiProcedure = publicProcedure
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
            giornataSerieA: 'desc',
          },
        },
        take: opts.input.top ? opts.input.top : 1000,
      })

      if (result !== null) {
        return result.map((c) => ({
          id: c.idVoto,
          nome: c.Giocatori.nome,
          ruolo: c.Giocatori.ruolo,
          voto: c.voto?.toNumber() ?? null,
          ammonizione: c.ammonizione.toNumber() ?? null,
          espulsione: c.espulsione.toNumber() ?? null,
          gol:
            c.Giocatori.ruolo === 'P'
              ? (c.gol?.toNumber() ?? 0) / Configurazione.bonusGolSubito
              : (c.gol?.toNumber() ?? 0) / Configurazione.bonusGol,
          assist: (c.assist?.toNumber() ?? 0) / Configurazione.bonusAssist,
          autogol: (c.autogol?.toNumber() ?? 0) / Configurazione.bonusAutogol,
          altriBonus: c.altriBonus?.toNumber() ?? null,
          torneo: c.Calendario.Tornei.nome,
          gruppoFase: c.Calendario.Tornei.gruppoFase,
          giornataSerieA: c.Calendario.giornataSerieA,
        }))
      } else return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

import Logger from '~/lib/logger.server'
import { adminProcedure } from '../trpc'
import { z } from 'zod'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'

export const showVotoProcedure = adminProcedure
  .input(
    z.object({
      idVoto: z.number(),
    }),
  )
  .query(async (opts) => {
    try {
      const result = await prisma.voti.findUnique({
        where: {
          idVoto: opts.input.idVoto,
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
      })

      if (result !== null) {
        return {
          idVoto: result.idVoto,
          nome: result.Giocatori.nome,
          ruolo: result.Giocatori.ruolo,
          voto: result.voto?.toNumber() ?? null,
          ammonizione: result.ammonizione?.toNumber() ?? null,
          espulsione: result.espulsione?.toNumber() ?? null,
          gol:
            result.Giocatori.ruolo === 'P'
              ? (result.gol?.toNumber() ?? 0) / Configurazione.bonusGolSubito
              : (result.gol?.toNumber() ?? 0) / Configurazione.bonusGol,
          assist: (result.assist?.toNumber() ?? 0) / Configurazione.bonusAssist,
          autogol:
            (result.autogol?.toNumber() ?? 0) / Configurazione.bonusAutogol,
          altriBonus: result.altriBonus?.toNumber() ?? null,
          torneo: result.Calendario.Tornei.nome,
          gruppoFase: result.Calendario.Tornei.gruppoFase,
        }
      } else return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

import Logger from '~/lib/logger.server'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import { Configurazione } from '~/config'
import { Voti } from '~/server/db/entities'

export const showVotoProcedure = adminProcedure
  .input(
    z.object({
      idVoto: z.number(),
    }),
  )
  .query(async (opts) => {
    try {
      const result = await Voti.findOne({
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
          Giocatori: { nome: true, ruolo: true },
          Calendario: {
            giornataSerieA: true,
            Tornei: { nome: true, gruppoFase: true },
          },
        },
        relations: {
          Giocatori: true,
          Calendario: { Tornei: true },
        },
      })

      if (result !== null) {
        return {
          idVoto: result.idVoto,
          nome: result.Giocatori.nome,
          ruolo: result.Giocatori.ruolo,
          voto: result.voto ?? null,
          ammonizione: result.ammonizione ?? null,
          espulsione: result.espulsione ?? null,
          gol:
            result.Giocatori.ruolo === 'P'
              ? (result.gol ?? 0 / Configurazione.bonusGolSubito)
              : (result.gol ?? 0 / Configurazione.bonusGol),
          assist: result.assist ?? 0 / Configurazione.bonusAssist,
          autogol: result.autogol ?? 0 / Configurazione.bonusAutogol,
          altriBonus: result.altriBonus ?? null,
          torneo: result.Calendario.Tornei.nome,
          gruppoFase: result.Calendario.Tornei.gruppoFase,
        }
      } else return null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

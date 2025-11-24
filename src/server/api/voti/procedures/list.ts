import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import { Configurazione } from '~/config'
import { Voti } from '~/server/db/entities'

export const listVotiProcedure = publicProcedure
  .input(
    z.object({
      idGiocatore: z.number(),
      top: z.number().nullable().optional(),
    }),
  )
  .query(async (opts) => {
    try {
      const result = await Voti.find({
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
          Giocatori: { nome: true, ruolo: true },
          Calendario: {
            giornataSerieA: true,
            Tornei: { nome: true, gruppoFase: true },
          },
        },
        order: {
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
          voto: c.voto,
          ammonizione: c.ammonizione,
          espulsione: c.espulsione,
          gol:
            c.Giocatori.ruolo === 'P'
              ? (c.gol ?? 0) / Configurazione.bonusGolSubito
              : (c.gol ?? 0) / Configurazione.bonusGol,
          assist: (c.assist ?? 0) / Configurazione.bonusAssist,
          autogol: (c.autogol ?? 0) / Configurazione.bonusAutogol,
          altriBonus: c.altriBonus,
          torneo: c.Calendario.Tornei.nome,
          gruppoFase: c.Calendario.Tornei.gruppoFase,
          giornataSerieA: c.Calendario.giornataSerieA,
        }))
      } else return null
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

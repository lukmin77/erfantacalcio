import { z } from 'zod'
import Logger from '~/lib/logger.server'
import { publicProcedure } from '../../trpc'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'
import { getRuoloEsteso, normalizeCampioncinoUrl } from '~/utils/helper'

export const showStatistica = publicProcedure
  .input(
    z.object({
      idGiocatore: z.number(),
    }),
  )
  .query(async (opts) => {
    const idGiocatore = +opts.input.idGiocatore
    try {
      const giocatore = await prisma.giocatori.findUnique({
        select: { ruolo: true, nome: true, nomeFantaGazzetta: true },
        where: { idGiocatore: idGiocatore },
      })

      const trasferimento = await prisma.trasferimenti.findFirst({
        select: {
          costo: true,
          dataAcquisto: true,
          SquadreSerieA: { select: { nome: true, maglia: true } },
          Utenti: { select: { nomeSquadra: true } },
        },
        where: {
          AND: [{ idGiocatore: idGiocatore }, { dataCessione: null }],
        },
        orderBy: { idTrasferimento: 'desc' },
      })

      if (giocatore) {
        const result = await prisma.voti.aggregate({
          _avg: { voto: true },
          _sum: {
            ammonizione: true,
            espulsione: true,
            gol: true,
            assist: true,
          },
          _count: { idCalendario: true },
          where: {
            idGiocatore: idGiocatore,
            voto: { gt: 0 },
            Calendario: {
              OR: [
                { hasSovrapposta: false },
                {
                  AND: [{ hasSovrapposta: true }, { idTorneo: 1 }],
                },
              ],
            },
          },
        })

        return {
          ruolo: giocatore.ruolo,
          nome: giocatore.nome,
          nomeFantagazzetta: giocatore.nomeFantaGazzetta,
          media: result._avg.voto?.toFixed(2),
          gol:
            giocatore.ruolo === 'P'
              ? Number(result._sum.gol) * Configurazione.bonusGolSubito
              : Number(result._sum.gol) / Configurazione.bonusGol,
          assist: Number(result._sum.assist) / Configurazione.bonusAssist,
          ammonizioni: Math.abs(
            Number(result._sum.ammonizione) / Configurazione.bonusAmmonizione,
          ),
          espulsioni: Math.abs(
            Number(result._sum.espulsione) / Configurazione.bonusEspulsione,
          ),
          giocate: Number(result._count.idCalendario),
          costo: trasferimento?.costo,
          dataAcquisto: trasferimento?.dataAcquisto,
          squadraSerieA: trasferimento?.SquadreSerieA?.nome,
          magliaSerieA: trasferimento?.SquadreSerieA?.maglia,
          squadra: trasferimento?.Utenti?.nomeSquadra,
          ruoloEsteso: getRuoloEsteso(giocatore.ruolo),
          isVenduto: false,
          urlCampioncino: normalizeCampioncinoUrl(
            Configurazione.urlCampioncino,
            giocatore.nome,
            giocatore.nomeFantaGazzetta,
          ),
          urlCampioncinoSmall: normalizeCampioncinoUrl(
            Configurazione.urlCampioncinoSmall,
            giocatore.nome,
            giocatore.nomeFantaGazzetta,
          ),
        }
      }
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

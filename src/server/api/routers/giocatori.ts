import Logger from '~/lib/logger'
import { z } from 'zod'
import {
  getRuoloEsteso,
  normalizeCampioncinoUrl,
  normalizeNomeGiocatore,
} from '~/utils/helper'
import {
  deleteGiocatore,
  deleteVotiGiocatore,
  getGiocatoreById,
} from './common'
import { type iGiocatoreStats } from '~/types/giocatori'
import { Configurazione } from '~/config'

import prisma from '~/utils/db'

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from '~/server/api/trpc'

export const giocatoriRouter = createTRPCRouter({
  upsert: adminProcedure
    .input(
      z.object({
        idGiocatore: z.number(),
        ruolo: z.string(),
        nome: z.string(),
        nomeFantagazzetta: z.string().nullable(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const giocatore = await prisma.giocatori.upsert({
          where: {
            idGiocatore: opts.input.idGiocatore,
          },
          update: {
            nome: normalizeNomeGiocatore(opts.input.nome),
            nomeFantaGazzetta: opts.input.nomeFantagazzetta
              ? normalizeNomeGiocatore(opts.input.nomeFantagazzetta)
              : null,
            ruolo: opts.input.ruolo,
          },
          create: {
            nome: normalizeNomeGiocatore(opts.input.nome),
            nomeFantaGazzetta: opts.input.nomeFantagazzetta
              ? normalizeNomeGiocatore(opts.input.nomeFantagazzetta)
              : null,
            ruolo: opts.input.ruolo,
          },
        })
        return giocatore.idGiocatore
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  delete: adminProcedure.input(z.number()).mutation(async (opts) => {
    const idGiocatore = +opts.input

    try {
      await deleteVotiGiocatore(idGiocatore)
      await deleteTrasferimentiGiocatore(idGiocatore)
      await deleteGiocatore(idGiocatore)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  }),

  get: publicProcedure
    .input(
      z.object({
        idGiocatore: z.number(),
      }),
    )
    .query(async (opts) => {
      try {
        return await getGiocatoreById(+opts.input.idGiocatore)
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  listAll: publicProcedure.query(async () => {
    try {
      const giocatori = await prisma.giocatori.findMany({
        orderBy: { nome: 'asc' },
      })

      if (giocatori) {
        return giocatori.map((giocatore) => ({
          id: giocatore.idGiocatore,
          label: `${giocatore.nome} - ${getRuoloEsteso(giocatore.ruolo)}`,
        }))
      }
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  }),

  listStatistiche: publicProcedure
    .input(
      z.object({
        ruolo: z.string(),
      }),
    )
    .query(async (opts) => {
      try {
        let stat: iGiocatoreStats[] | undefined
        let maxGiocate = 0
        let sogliaGiocate = 0

        switch (opts.input.ruolo) {
          case 'P':
            maxGiocate =
              (await prisma.statsA.aggregate({ _max: { giocate: true } }))._max
                ?.giocate ?? 0
            sogliaGiocate =
              maxGiocate * (Configurazione.percentualeMinimaGiocate / 100)
            stat = await prisma.statsP.findMany({
              select: {
                media: true,
                mediabonus: true,
                golfatti: true,
                golsubiti: true,
                assist: true,
                ammonizioni: true,
                espulsioni: true,
                giocate: true,
                ruolo: true,
                nome: true,
                nomefantagazzetta: true,
                idgiocatore: true,
                maglia: true,
                squadraSerieA: true,
                squadra: true,
                idSquadra: true,
              },
              where: {
                giocate: {
                  gte: sogliaGiocate, // Escludi i giocatori con una percentuale di giocate inferiore al 70% del massimo
                },
              },
              orderBy: [
                { media: 'desc' },
                { mediabonus: 'desc' },
                { giocate: 'desc' },
              ],
              skip: 0,
              take: Configurazione.recordCount,
            })
            break
          case 'D':
            maxGiocate =
              (await prisma.statsA.aggregate({ _max: { giocate: true } }))._max
                ?.giocate ?? 0
            sogliaGiocate =
              maxGiocate * (Configurazione.percentualeMinimaGiocate / 100)
            stat = await prisma.statsD.findMany({
              select: {
                media: true,
                mediabonus: true,
                golfatti: true,
                golsubiti: true,
                assist: true,
                ammonizioni: true,
                espulsioni: true,
                giocate: true,
                ruolo: true,
                nome: true,
                nomefantagazzetta: true,
                idgiocatore: true,
                maglia: true,
                squadraSerieA: true,
                squadra: true,
                idSquadra: true,
              },
              where: {
                giocate: {
                  gte: sogliaGiocate, // Escludi i giocatori con una percentuale di giocate inferiore al 70% del massimo
                },
              },
              orderBy: [
                { media: 'desc' },
                { mediabonus: 'desc' },
                { giocate: 'desc' },
              ],
              skip: 0,
              take: Configurazione.recordCount,
            })
            break
          case 'C':
            maxGiocate =
              (await prisma.statsA.aggregate({ _max: { giocate: true } }))._max
                ?.giocate ?? 0
            sogliaGiocate =
              maxGiocate * (Configurazione.percentualeMinimaGiocate / 100)
            stat = await prisma.statsC.findMany({
              select: {
                media: true,
                mediabonus: true,
                golfatti: true,
                golsubiti: true,
                assist: true,
                ammonizioni: true,
                espulsioni: true,
                giocate: true,
                ruolo: true,
                nome: true,
                nomefantagazzetta: true,
                idgiocatore: true,
                maglia: true,
                squadraSerieA: true,
                squadra: true,
                idSquadra: true,
              },
              where: {
                giocate: {
                  gte: sogliaGiocate, // Escludi i giocatori con una percentuale di giocate inferiore al 70% del massimo
                },
              },
              orderBy: [
                { media: 'desc' },
                { mediabonus: 'desc' },
                { giocate: 'desc' },
              ],
              skip: 0,
              take: Configurazione.recordCount,
            })
            break
          case 'A':
            maxGiocate =
              (await prisma.statsA.aggregate({ _max: { giocate: true } }))._max
                ?.giocate ?? 0
            sogliaGiocate =
              maxGiocate * (Configurazione.percentualeMinimaGiocate / 100)
            stat = await prisma.statsA.findMany({
              select: {
                media: true,
                mediabonus: true,
                golfatti: true,
                golsubiti: true,
                assist: true,
                ammonizioni: true,
                espulsioni: true,
                giocate: true,
                ruolo: true,
                nome: true,
                nomefantagazzetta: true,
                idgiocatore: true,
                maglia: true,
                squadraSerieA: true,
                squadra: true,
                idSquadra: true,
              },
              where: {
                giocate: {
                  gte: sogliaGiocate, // Escludi i giocatori con una percentuale di giocate inferiore al 70% del massimo
                },
              },
              orderBy: [
                { media: 'desc' },
                { mediabonus: 'desc' },
                { giocate: 'desc' },
              ],
              skip: 0,
              take: Configurazione.recordCount,
            })
            break
        }
        return stat
          ? stat.map((player) => ({
              ...player,
              id: player.idgiocatore,
              maglia: `/images/maglie/${player.maglia}`,
            }))
          : []
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  ///Ritorna le statistiche (mediavoto, gol, assist, ecc ecc) della stagione attuale
  getStatistica: publicProcedure
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
    }),
})

async function deleteTrasferimentiGiocatore(idGiocatore: number) {
  try {
    await prisma.trasferimenti.deleteMany({
      where: {
        idGiocatore: idGiocatore,
      },
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

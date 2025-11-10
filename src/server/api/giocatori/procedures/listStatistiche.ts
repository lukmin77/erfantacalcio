import Logger from '~/lib/logger.server'
import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import { iGiocatoreStats } from '~/types/giocatori'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'

export const listStatistiche = publicProcedure
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
  })

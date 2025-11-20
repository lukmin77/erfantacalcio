import Logger from '~/lib/logger.server'
import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import { StatsA, StatsC, StatsD, StatsP } from '~/server/db/entities'

export const listStatisticheSquadra = publicProcedure
  .input(
    z.object({
      id_squadra: z.number(),
    }),
  )
  .query(async (opts) => {
    try {
      const playerStatsSelect = {
        maglia: true,
        ruolo: true,
        media: true,
        mediabonus: true,
        golfatti: true,
        golsubiti: true,
        assist: true,
        giocate: true,
        nome: true,
        idgiocatore: true,
        squadraSerieA: true,
        idSquadra: true,
      }
      const whereClause = { idSquadra: opts.input.id_squadra }
      const [statsP, statsD, statsC, statsA] = await Promise.all([
        StatsP.find({
          select: playerStatsSelect,
          where: whereClause,
        }),
        StatsD.find({
          select: playerStatsSelect,
          where: whereClause,
        }),
        StatsC.find({
          select: playerStatsSelect,
          where: whereClause,
        }),
        StatsA.find({
          select: playerStatsSelect,
          where: whereClause,
        }),
      ])

      let stat = [...statsP, ...statsD, ...statsC, ...statsA]

      return stat
        ? stat.map((player) => ({
            ...player,
            id: player.idgiocatore,
            maglia: `/images/maglie/${player.maglia}`,
            gol:
              player.ruolo === 'P'
                ? -Number(player.golsubiti)
                : Number(player.golfatti),
          }))
        : []
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import { Configurazione } from '~/config'
import { StatsA, StatsC, StatsD, StatsP } from '~/server/db/entities'
import { FindManyOptions, MoreThanOrEqual } from 'typeorm'

const roleEntityMap: Record<string, any> = {
  P: StatsP,
  D: StatsD,
  C: StatsC,
  A: StatsA,
}

const toClientPlayer = (player: any) => ({
  ...player,
  id: player.idgiocatore,
  maglia: player.maglia ? `/images/maglie/${player.maglia}` : player.maglia,
})

export const listStatistiche = publicProcedure
  .input(
    z.object({
      ruolo: z.string(),
    }),
  )
  .query(async (opts) => {
    try {
      const ruolo = (opts.input.ruolo ?? '').toUpperCase()
      const Entity = roleEntityMap[ruolo]
      if (!Entity) return []

      const maxGiocateRow = await StatsP.createQueryBuilder('s')
        .select('MAX(s.giocate)', 'max')
        .getRawOne()
      const maxGiocate = Number(maxGiocateRow?.max ?? 0)
      const sogliaGiocate = Math.floor(maxGiocate * (Configurazione.percentualeMinimaGiocate / 100))

      const findOptions: FindManyOptions = {
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
          giocate: MoreThanOrEqual(sogliaGiocate),
        },
        order: { media: 'desc', mediabonus: 'desc', giocate: 'desc' },
        skip: 0,
        take: Configurazione.recordCount,
      }

      const rows = await Entity.find(findOptions)
      return rows.map(toClientPlayer)
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

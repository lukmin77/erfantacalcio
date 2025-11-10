import { createTRPCRouter } from '~/server/api/trpc'
import { listSquadreSerieAProcedure } from './procedures/list'

export const squadreSerieARouter = createTRPCRouter({
  list: listSquadreSerieAProcedure,
})

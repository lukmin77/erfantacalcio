import { createTRPCRouter } from '~/server/api/trpc'
import { listClassificaProcedure } from './procedures/list'

export const classificaRouter = createTRPCRouter({
  list: listClassificaProcedure,
})

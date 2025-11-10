import { createTRPCRouter } from '~/server/api/trpc'
import { listTorneiProcedure } from './procedures/list'

export const torneiRouter = createTRPCRouter({
  list: listTorneiProcedure,
})

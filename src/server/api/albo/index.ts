import { createTRPCRouter } from '~/server/api/trpc'
import { listAlboProcedure } from './procedures/list'
import { getAlboProcedure } from './procedures/show'

export const alboRouter = createTRPCRouter({
  list: listAlboProcedure,
  get: getAlboProcedure,
})

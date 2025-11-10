import { createTRPCRouter } from '~/server/api/trpc'
import { listAlboProcedure } from './list'
import { getAlboProcedure } from './get'

export const alboRouter = createTRPCRouter({
  list: listAlboProcedure,
  get: getAlboProcedure,
})

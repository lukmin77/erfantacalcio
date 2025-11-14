import { createTRPCRouter } from '~/server/api/trpc'
import { listSquadreProcedure } from './procedures/list'
import { getSquadraProcedure } from './procedures/get'
import { getMagliaProcedure } from './procedures/getMaglia'
import { getRosaProcedure } from './procedures/getRosa'
import { updateSquadraProcedure } from './procedures/update'
import { updateMagliaProcedure } from './procedures/updateMaglia'

export const squadreRouter = createTRPCRouter({
  list: listSquadreProcedure,
  get: getSquadraProcedure,
  getMaglia: getMagliaProcedure,
  getRosa: getRosaProcedure,
  update: updateSquadraProcedure,
  updateMaglia: updateMagliaProcedure,
})

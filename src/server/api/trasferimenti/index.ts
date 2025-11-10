import { createTRPCRouter } from '~/server/api/trpc'
import { listTrasferimentiProcedure } from './procedures/list'
import { statsStagioniProcedure } from './procedures/statsStagioni'
import { getTrasferimentoProcedure } from './procedures/get'
import { upsertTrasferimentoProcedure } from './procedures/upsert'
import { deleteTrasferimentoProcedure } from './procedures/delete'
import { chiudiTrasferimentoProcedure } from './procedures/chiudiTrasferimento'

export const trasferimentiRouter = createTRPCRouter({
  list: listTrasferimentiProcedure,
  statsStagioni: statsStagioniProcedure,
  get: getTrasferimentoProcedure,
  upsert: upsertTrasferimentoProcedure,
  delete: deleteTrasferimentoProcedure,
  chiudiTrasferimento: chiudiTrasferimentoProcedure,
})

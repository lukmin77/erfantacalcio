import { createTRPCRouter } from '~/server/api/trpc'
import { updateRisultatiProcedure } from './procedures/update'
import { getGiornataPartiteProcedure } from './procedures/getGiornataPartite'
import { getTabellinoProcedure } from './procedures/getTabellino'

export const risultatiRouter = createTRPCRouter({
  update: updateRisultatiProcedure,
  getGiornataPartite: getGiornataPartiteProcedure,
  getTabellino: getTabellinoProcedure,
})

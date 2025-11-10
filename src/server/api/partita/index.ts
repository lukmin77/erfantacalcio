import { createTRPCRouter } from '~/server/api/trpc'
import { getFormazioniProcedure } from './procedures/getFormazioni'
import { getTabelliniProcedure } from './procedures/getTabellini'

export const partitaRouter = createTRPCRouter({
  getFormazioni: getFormazioniProcedure,
  getTabellini: getTabelliniProcedure,
})

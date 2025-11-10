import { createTRPCRouter } from '~/server/api/trpc'
import { listPartiteBySquadraProcedure } from './procedures/listPartiteBySquadra'
import { listCalendarioProcedure } from './procedures/list'
import { getOneCalendarioProcedure } from './procedures/getOne'
import { updateCalendarioProcedure } from './procedures/update'
import { getProssimeGiornateProcedure } from './procedures/getProssimeGiornate'
import { getUltimiRisultatiProcedure } from './procedures/getUltimiRisultati'
import { listByGironeProcedure } from './procedures/listByGirone'
import { listRecuperiProcedure } from './procedures/listRecuperi'
import { listByTorneoProcedure } from './procedures/listByTorneo'
import { getByGiornataAndTorneoProcedure } from './procedures/getByGiornataAndTorneo'
import { getByIdCalendarioProcedure } from './procedures/getByIdCalendario'
import { listAttualeProcedure } from './procedures/listAttuale'

export const calendarioRouter = createTRPCRouter({
  listPartiteBySquadra: listPartiteBySquadraProcedure,
  list: listCalendarioProcedure,
  getOne: getOneCalendarioProcedure,
  update: updateCalendarioProcedure,
  getProssimeGiornate: getProssimeGiornateProcedure,
  getUltimiRisultati: getUltimiRisultatiProcedure,
  listByGirone: listByGironeProcedure,
  listRecuperi: listRecuperiProcedure,
  listByTorneo: listByTorneoProcedure,
  getByGiornataAndTorneo: getByGiornataAndTorneoProcedure,
  getByIdCalendario: getByIdCalendarioProcedure,
  listAttuale: listAttualeProcedure,
})

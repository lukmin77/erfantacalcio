import { createTRPCRouter } from '~/server/api/trpc'
import _ from 'lodash'
import { processVotiProcedure } from './processVoti'
import { showVotoProcedure } from './show'
import { listVotiProcedure } from './list'
import { showStatisticaVotiProcedure } from './showStatisticaVoti'
import { updateVotoProcedure } from './updateVoto'
import { uploadVotiProcedure } from './uploadVoti'
import { uploadVotiVercelProcedure } from './uploadVotiVercel'
import { resetVotiProcedure } from './resetVoti'
import { readVotiProcedure } from './readVoti'
import { refreshStatsProcedure } from './refreshStats'

export const votiRouter = createTRPCRouter({
  get: showVotoProcedure,
  list: listVotiProcedure,
  getStatisticaVoti: showStatisticaVotiProcedure,
  update: updateVotoProcedure,
  upload: uploadVotiProcedure,
  uploadVercel: uploadVotiVercelProcedure,
  resetVoti: resetVotiProcedure,
  readVoti: readVotiProcedure,
  processVoti: processVotiProcedure,
  refreshStats: refreshStatsProcedure,
})

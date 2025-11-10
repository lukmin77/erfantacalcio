import { createTRPCRouter } from '~/server/api/trpc'
import _ from 'lodash'
import { processVotiProcedure } from './voti/processVoti'
import { showVotoProcedure } from './voti/show'
import { listVotiProcedure } from './voti/list'
import { showStatisticaVotiProcedure } from './voti/showStatisticaVoti'
import { updateVotoProcedure } from './voti/updateVoto'
import { uploadVotiProcedure } from './voti/uploadVoti'
import { uploadVotiVercelProcedure } from './voti/uploadVotiVercel'
import { resetVotiProcedure } from './voti/resetVoti'
import { readVotiProcedure } from './voti/readVoti'
import { refreshStatsProcedure } from './voti/refreshStats'

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

import { createTRPCRouter } from '~/server/api/trpc'
import { changePasswordProcedure } from './procedures/changePassword'
import { uploadFotoProcedure } from './procedures/uploadFoto'
import { uploadFotoVercelProcedure } from './procedures/uploadFotoVercel'
import { deleteFotoProcedure } from './procedures/deleteFoto'
import { updateFotoProcedure } from './procedures/updateFoto'

export const profiloRouter = createTRPCRouter({
  changePassword: changePasswordProcedure,
  uploadFoto: uploadFotoProcedure,
  uploadFotoVercel: uploadFotoVercelProcedure,
  deleteFoto: deleteFotoProcedure,
  updateFoto: updateFotoProcedure,
})

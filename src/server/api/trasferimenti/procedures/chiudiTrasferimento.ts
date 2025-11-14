import { adminProcedure } from '~/server/api/trpc'
import { chiudiTrasferimentoGiocatore } from '../../../utils/common'

export const chiudiTrasferimentoProcedure = adminProcedure
  .input((val: unknown) => Number(val))
  .mutation(async (opts) => {
    const idGiocatore = +opts.input
    return await chiudiTrasferimentoGiocatore(idGiocatore, false)
  })

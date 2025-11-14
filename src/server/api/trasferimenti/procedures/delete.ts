import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { adminProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { deleteGiocatore, deleteVotiGiocatore } from '../../../utils/common'

export const deleteTrasferimentoProcedure = adminProcedure
  .input(z.number())
  .mutation(async (opts) => {
    const idtrasferimento = +opts.input
    try {
      const trasferimento = await prisma.trasferimenti.delete({
        where: { idTrasferimento: idtrasferimento },
      })
      const count = await prisma.trasferimenti.count({
        where: { idGiocatore: trasferimento.idGiocatore },
      })
      if (count === 0) {
        await deleteVotiGiocatore(trasferimento.idGiocatore)
        await deleteGiocatore(trasferimento.idGiocatore)
      }
      return trasferimento.idTrasferimento ?? null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

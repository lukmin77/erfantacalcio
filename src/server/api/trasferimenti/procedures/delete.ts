import Logger from '~/lib/logger.server'
import { adminProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { deleteGiocatore, deleteVotiGiocatore } from '../../../utils/common'
import { AppDataSource } from '~/data-source'
import { Trasferimenti } from '~/server/db/entities'

export const deleteTrasferimentoProcedure = adminProcedure
  .input(z.number())
  .mutation(async (opts) => {
    const idtrasferimento = +opts.input
    try {
      AppDataSource.transaction(async (trx) => {
        const trasferimento = await trx.findOneOrFail(Trasferimenti, {
          select: { idGiocatore: true },
          where: { idTrasferimento: idtrasferimento },
        })
        await trx.delete(Trasferimenti, {
          where: { idTrasferimento: idtrasferimento },
        })
        const count = await trx.count(Trasferimenti, {
          where: { idGiocatore: trasferimento.idGiocatore },
        })
        if (count === 0) {
          await deleteVotiGiocatore(trx, trasferimento.idGiocatore)
          await deleteGiocatore(trx, trasferimento.idGiocatore)
        }
        return idtrasferimento ?? null
      })
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

import { deleteGiocatore, deleteVotiGiocatore } from '~/server/utils/common'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import { Trasferimenti } from '~/server/db/entities'
import { AppDataSource } from '~/data-source'
import { EntityManager } from 'typeorm'

export const removeGiocatore = adminProcedure
  .input(z.number())
  .mutation(async (opts) => {
    const idGiocatore = +opts.input

    try {
      AppDataSource.transaction(async (trx) => {
        await deleteVotiGiocatore(trx, idGiocatore)
        await deleteTrasferimentiGiocatore(trx, idGiocatore)
        await deleteGiocatore(trx, idGiocatore)
      })
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

async function deleteTrasferimentiGiocatore(
  trx: EntityManager,
  idGiocatore: number,
) {
  try {
    await trx.delete(Trasferimenti, {
      idGiocatore: idGiocatore,
    })
  } catch (error) {
    console.error('Si è verificato un errore', error)
    throw error
  }
}

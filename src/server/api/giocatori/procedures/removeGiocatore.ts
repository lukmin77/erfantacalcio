import Logger from '~/lib/logger.server'
import { deleteGiocatore, deleteVotiGiocatore } from '~/server/utils/common'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import prisma from '~/utils/db'

export const removeGiocatore = adminProcedure
  .input(z.number())
  .mutation(async (opts) => {
    const idGiocatore = +opts.input

    try {
      await deleteVotiGiocatore(idGiocatore)
      await deleteTrasferimentiGiocatore(idGiocatore)
      await deleteGiocatore(idGiocatore)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

async function deleteTrasferimentiGiocatore(idGiocatore: number) {
  try {
    await prisma.trasferimenti.deleteMany({
      where: {
        idGiocatore: idGiocatore,
      },
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

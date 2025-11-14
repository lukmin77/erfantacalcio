import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { protectedProcedure } from '~/server/api/trpc'
import { magliaType } from '~/components/selectColors'

export const getMagliaProcedure = protectedProcedure.query(
  async (opts): Promise<magliaType | null> => {
    const idUtente = +opts.ctx.session.user.idSquadra
    try {
      const utente = await prisma.utenti.findUnique({
        where: { idUtente },
      })

      if (!utente || !utente.maglia) {
        return null
      }

      return JSON.parse(utente.maglia) as magliaType
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  },
)

import Logger from '~/lib/logger.server'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'

export const refreshStatsProcedure = adminProcedure
  .input(
    z.object({
      ruolo: z.string(),
    }),
  )
  .mutation(async (opts) => {
    await refreshStats(opts.input.ruolo)
  })

async function refreshStats(ruolo: string) {
  try {
    Logger.info(
      `Function sp_RefreshStats${ruolo} for stagione ${Configurazione.stagione} executing`,
    )
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        PERFORM public.sp_RefreshStats_${ruolo}('${ruolo}', '${Configurazione.stagione}');
      END $$;
    `)
    Logger.info(
      `Function sp_RefreshStats${ruolo} for stagione ${Configurazione.stagione} executed successfully`,
    )
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
  }
}

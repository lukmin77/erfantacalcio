import Logger from '~/lib/logger.server'
import { adminProcedure } from '../../trpc'
import { z } from 'zod'
import { Configurazione } from '~/config'
import { AppDataSource } from '~/data-source'

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
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.query(
        `
        DO $$
        BEGIN
          PERFORM public.sp_RefreshStats_${ruolo}($1, $2);
        END $$;
        `,
        [ruolo, Configurazione.stagione],
      )
    } finally {
      await queryRunner.release()
    }
    Logger.info(
      `Function sp_RefreshStats${ruolo} for stagione ${Configurazione.stagione} executed successfully`,
    )
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
  }
}

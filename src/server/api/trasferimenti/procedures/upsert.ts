import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { adminProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { chiudiTrasferimentoGiocatore } from '../../../utils/common'
import { Configurazione } from '~/config'
import { toLocaleDateTime } from '~/utils/dateUtils'

export const upsertTrasferimentoProcedure = adminProcedure
  .input(
    z.object({
      idTrasferimento: z.number(),
      idGiocatore: z.number(),
      idSquadraSerieA: z.number().optional().nullable(),
      idSquadra: z.number().optional().nullable(),
      costo: z.number(),
      dataAcquisto: z.date().optional(),
      dataCessione: z.date().optional().nullable(),
    }),
  )
  .mutation(async (opts) => {
    try {
      const squadra = await prisma.utenti.findUnique({
        select: { nomeSquadra: true },
        where: { idUtente: opts.input.idSquadra ?? -1 },
      })
      const squadraSerieA = await prisma.squadreSerieA.findUnique({
        select: { nome: true },
        where: { idSquadraSerieA: opts.input.idSquadraSerieA ?? -1 },
      })

      if (opts.input.idTrasferimento === 0) {
        await chiudiTrasferimentoGiocatore(opts.input.idGiocatore, false)
      }

      const trasferimento = await prisma.trasferimenti.upsert({
        where: { idTrasferimento: opts.input.idTrasferimento },
        update: {
          idSquadraSerieA: opts.input.idSquadraSerieA ?? null,
          idSquadra: opts.input.idSquadra ?? null,
          nomeSquadra: squadra?.nomeSquadra,
          nomeSquadraSerieA: squadraSerieA?.nome,
          costo: opts.input.costo,
          dataAcquisto: opts.input.dataAcquisto,
          dataCessione: opts.input.dataCessione,
          stagione: Configurazione.stagione,
          hasRitirato: false,
        },
        create: {
          idGiocatore: opts.input.idGiocatore,
          idSquadraSerieA: opts.input.idSquadraSerieA,
          idSquadra: opts.input.idSquadra,
          costo: opts.input.costo,
          dataAcquisto: toLocaleDateTime(new Date()),
          dataCessione: null,
          stagione: Configurazione.stagione,
          hasRitirato: false,
        },
      })

      return trasferimento.idTrasferimento ?? null
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

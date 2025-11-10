import Logger from '~/lib/logger.server'
import { z } from 'zod'
import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'
import { RuoloUtente } from '~/utils/enums'
import {
  getTorneo,
  getDescrizioneTorneo,
  getTorneoTitle,
  getTorneoSubTitle,
} from '../../../utils/common'
import { mapPartite } from '../services/partiteMapping'

export const getGiornataPartiteProcedure = publicProcedure
  .input(
    z.object({
      idCalendario: z.number(),
      includeTabellini: z.boolean(),
      backOfficeMode: z.boolean(),
    }),
  )
  .query(async (opts) => {
    try {
      const result = await prisma.calendario.findUnique({
        select: {
          idCalendario: true,
          giornata: true,
          giornataSerieA: true,
          ordine: true,
          data: true,
          dataFine: true,
          hasSovrapposta: true,
          girone: true,
          hasGiocata: true,
          Tornei: { select: { idTorneo: true, nome: true, gruppoFase: true } },
          Partite: {
            select: {
              idPartita: true,
              idSquadraH: true,
              idSquadraA: true,
              hasMultaH: true,
              hasMultaA: true,
              golH: true,
              golA: true,
              fattoreCasalingo: true,
              Utenti_Partite_idSquadraHToUtenti: {
                select: { nomeSquadra: true, foto: true, maglia: true },
              },
              Utenti_Partite_idSquadraAToUtenti: {
                select: { nomeSquadra: true, foto: true, maglia: true },
              },
            },
          },
        },
        where: { idCalendario: opts.input.idCalendario },
      })

      if (result)
        return {
          idCalendario: result.idCalendario,
          idTorneo: result.Tornei.idTorneo,
          giornata: result.giornata,
          giornataSerieA: result.giornataSerieA,
          isGiocata: result.hasGiocata,
          isSovrapposta: result.hasSovrapposta,
          data: result.data?.toISOString(),
          dataFine: result.dataFine?.toISOString(),
          girone: result.girone,
          partite: await mapPartite(
            result.Partite,
            opts.input.includeTabellini,
            opts.ctx.session?.user?.ruolo === RuoloUtente.contributor
              ? false
              : opts.input.backOfficeMode,
          ),
          Torneo: getTorneo(result.Tornei.nome, result.Tornei.gruppoFase),
          Descrizione: getDescrizioneTorneo(
            result.Tornei.nome,
            result.giornata,
            result.giornataSerieA,
            result.Tornei.gruppoFase,
          ),
          Title: getTorneoTitle(
            result.Tornei.nome,
            result.giornata,
            result.Tornei.gruppoFase,
          ),
          SubTitle: getTorneoSubTitle(result.giornataSerieA),
        }
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

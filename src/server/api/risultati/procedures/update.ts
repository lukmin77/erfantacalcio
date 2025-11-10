import Logger from '~/lib/logger.server'
import { z } from 'zod'
import prisma from '~/utils/db'
import { adminProcedure } from '~/server/api/trpc'
import { UpdateClassifica, getPunti } from '../services/classifica'

export const updateRisultatiProcedure = adminProcedure
  .input(
    z.object({
      idPartita: z.number(),
      escludi: z.boolean(),
      golHome: z.number().min(0).max(10),
      golAway: z.number().min(0).max(10),
      fantapuntiHome: z.number().min(0).max(120),
      fantapuntiAway: z.number().min(0).max(120),
      multaHome: z.boolean(),
      multaAway: z.boolean(),
    }),
  )
  .mutation(async (opts) => {
    try {
      const partita = await prisma.partite.findUnique({
        select: { idSquadraH: true, idSquadraA: true, idCalendario: true },
        where: { idPartita: opts.input.idPartita },
      })

      if (partita?.idSquadraH && partita?.idSquadraA) {
        const infoCalendario = await prisma.partite.findUnique({
          select: {
            idCalendario: true,
            Calendario: {
              select: {
                Tornei: { select: { idTorneo: true, hasClassifica: true } },
              },
            },
          },
          where: { idPartita: opts.input.idPartita },
        })
        const idSquadraHome = partita.idSquadraH
        const idSquadraAway = partita.idSquadraA

        await prisma.$transaction([
          prisma.formazioni.updateMany({
            data: { hasBloccata: true },
            where: { idPartita: opts.input.idPartita },
          }),
          prisma.calendario.update({
            data: { hasGiocata: true },
            where: { idCalendario: partita?.idCalendario },
          }),
          prisma.partite.update({
            data: {
              puntiH: getPunti(
                infoCalendario?.Calendario.Tornei.hasClassifica ?? false,
                opts.input.multaHome,
                opts.input.golHome,
                opts.input.golAway,
              ),
              puntiA: getPunti(
                infoCalendario?.Calendario.Tornei.hasClassifica ?? false,
                opts.input.multaAway,
                opts.input.golAway,
                opts.input.golHome,
              ),
              golH: opts.input.golHome,
              golA: opts.input.golAway,
              hasMultaH: opts.input.multaHome,
              hasMultaA: opts.input.multaAway,
              punteggioH: opts.input.fantapuntiHome,
              punteggioA: opts.input.fantapuntiAway,
            },
            where: { idPartita: opts.input.idPartita },
          }),
        ])
        Logger.info(
          `Aggiornate formazioni, calendario e partite per idpartita: ${opts.input.idPartita}`,
        )

        if (infoCalendario?.Calendario.Tornei.hasClassifica) {
          await UpdateClassifica(
            idSquadraHome,
            infoCalendario.Calendario.Tornei.idTorneo,
          )
          Logger.info(
            `Aggiornate classifica e utenti (multe) per idsquadraHome: ${idSquadraHome} e idTorneo: ${infoCalendario.Calendario.Tornei.idTorneo}`,
          )
          await UpdateClassifica(
            idSquadraAway,
            infoCalendario.Calendario.Tornei.idTorneo,
          )
          Logger.info(
            `Aggiornate classifica e utenti (multe) per idsquadraAway: ${idSquadraAway} e idTorneo: ${infoCalendario.Calendario.Tornei.idTorneo}`,
          )
        }
      }
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

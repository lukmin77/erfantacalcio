import Logger from '~/lib/logger.server'
import {
  getProssimaGiornata,
  getProssimaGiornataSerieA,
  getRosaDisponibile,
} from './common'
import { moduloDefault } from '~/utils/helper'
import { toLocaleDateTime } from '~/utils/dateUtils'
import { type GiocatoreFormazioneType } from '~/types/squadre'
import { ReSendMailAsync } from '~/service/mailSender'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

import prisma from '~/utils/db'
import { env } from 'process'

export const formazioneRouter = createTRPCRouter({
  getGiornateDaGiocare: protectedProcedure.query(async (opts) => {
    try {
      const idSquadraUtente = opts.ctx.session.user.idSquadra
      const giornataSerieA = await getProssimaGiornataSerieA(false, 'asc')
      const prossimeGiornate = await getProssimaGiornata(giornataSerieA)
      const giornateFiltrate = prossimeGiornate.filter((giornata) =>
        giornata.partite.some(
          (partita) =>
            partita.idHome === idSquadraUtente ||
            partita.idAway === idSquadraUtente,
        ),
      )
      return giornateFiltrate
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  }),

  get: protectedProcedure
    .input(
      z.object({
        idTorneo: z.number(),
      }),
    )
    .query(async (opts) => {
      const idSquadraUtente = opts.ctx.session.user.idSquadra
      const idTorneo = +opts.input.idTorneo
      try {
        const giornataSerieA = await getProssimaGiornataSerieA(false, 'asc')
        const prossimoCalendario = (
          await getProssimaGiornata(giornataSerieA)
        ).find((c) => c.idTorneo === idTorneo)
        const prossimaPartita = prossimoCalendario?.partite.find(
          (c) => c.idHome === idSquadraUtente || c.idAway === idSquadraUtente,
        )
        if (!prossimaPartita || !prossimoCalendario) {
          return null
        } else {
          const giocatoriSchierati = await prisma.voti.findMany({
            select: {
              idGiocatore: true,
              titolare: true,
              riserva: true,
            },
            where: {
              AND: [
                { idCalendario: prossimoCalendario.idCalendario },
                { Formazioni: { idSquadra: idSquadraUtente } },
              ],
            },
          })
          const datiFormazione = await prisma.formazioni.findFirst({
            select: { modulo: true },
            where: {
              AND: [
                { idPartita: prossimaPartita.idPartita },
                { idSquadra: idSquadraUtente },
              ],
            },
          })
          const rosa = await getRosaDisponibile(idSquadraUtente)
          const formazione: GiocatoreFormazioneType[] = rosa.map((r) => ({
            idGiocatore: r.idGiocatore,
            nome: r.nome,
            nomeFantagazzetta: r.nomeFantagazzetta,
            ruolo: r.ruolo,
            ruoloEsteso: r.ruoloEsteso,
            costo: r.costo,
            isVenduto: r.isVenduto,
            urlCampioncino: r.urlCampioncino,
            urlCampioncinoSmall: r.urlCampioncinoSmall,
            nomeSquadraSerieA: r.nomeSquadraSerieA,
            magliaSquadraSerieA: r.magliaSquadraSerieA,
            titolare:
              giocatoriSchierati.find((g) => g.idGiocatore === r.idGiocatore)
                ?.titolare ?? false,
            riserva:
              giocatoriSchierati.find((g) => g.idGiocatore === r.idGiocatore)
                ?.riserva ?? null,
          }))

          const dati = {
            idPartita: prossimaPartita.idPartita,
            data: prossimoCalendario.data,
            modulo: datiFormazione?.modulo ?? moduloDefault,
            giocatori: formazione,
          }

          return dati
        }
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        idPartita: z.number(),
        modulo: z.string(),
        giocatori: z.array(
          z.object({
            idGiocatore: z.number(),
            titolare: z.boolean(),
            riserva: z.number().nullable().optional(),
          }),
        ),
      }),
    )
    .mutation(async (opts) => {
      const idSquadra = opts.ctx.session.user.idSquadra
      const idPartita = +opts.input.idPartita
      const modulo = opts.input.modulo
      const giocatori = opts.input.giocatori

      try {
        const idFormazione = (
          await prisma.formazioni.findFirst({
            select: { idFormazione: true },
            where: {
              AND: [{ idPartita: idPartita }, { idSquadra: idSquadra }],
            },
          })
        )?.idFormazione

        if (idFormazione) {
          await prisma.voti.deleteMany({
            where: { idFormazione: idFormazione },
          })
        }
        Logger.info(`Eliminazione voti per idFormazione: ${idFormazione}`)

        const oldFormazione = await prisma.formazioni.findFirst({
          select: { idFormazione: true },
          where: {
            AND: [{ idPartita: idPartita }, { idSquadra: idSquadra }],
          },
        })

        if (oldFormazione) {
          await prisma.formazioni.delete({
            where: {
              idFormazione: oldFormazione.idFormazione,
            },
          })
        }

        Logger.info(
          `Eliminazione formazione per idSquadra: ${idSquadra} e idPartita:${idPartita}`,
        )

        const calendario = await prisma.partite.findUnique({
          select: {
            idCalendario: true,
            Utenti_Partite_idSquadraHToUtenti: {
              select: {
                nomeSquadra: true,
                presidente: true,
                idUtente: true,
                mail: true,
              },
            },
            Utenti_Partite_idSquadraAToUtenti: {
              select: {
                nomeSquadra: true,
                presidente: true,
                idUtente: true,
                mail: true,
              },
            },
          },
          where: { idPartita: idPartita },
        })
        Logger.info(
          `recupero idCalendario per idPartita: ${idSquadra}:${calendario?.idCalendario}`,
        )

        const formazione = await prisma.formazioni.create({
          data: {
            idPartita: idPartita,
            idSquadra: idSquadra,
            modulo: modulo,
            dataOra: toLocaleDateTime(new Date()),
            hasBloccata: false,
          },
        })
        Logger.info(`Creazione nuova formazione`, formazione)

        if (calendario) {
          await Promise.all(
            giocatori.map(async (c) => {
              await prisma.voti.createMany({
                data: {
                  idGiocatore: c.idGiocatore,
                  idCalendario: calendario.idCalendario,
                  idFormazione: formazione.idFormazione,
                  titolare: c.titolare,
                  riserva: c.riserva,
                },
              })
            }),
          )
          Logger.info(
            `Inseriti giocatori in tabella voti con idFormazione: ${formazione.idFormazione}`,
          )

          //invio mail
          if (env.MAIL_ENABLED) {
            const subject = `ErFantacalcio: Formazione partita ${calendario.Utenti_Partite_idSquadraHToUtenti?.nomeSquadra} - ${calendario.Utenti_Partite_idSquadraAToUtenti?.nomeSquadra}`
            const avversario =
              idSquadra ===
              calendario.Utenti_Partite_idSquadraHToUtenti?.idUtente
                ? calendario.Utenti_Partite_idSquadraHToUtenti?.presidente
                : calendario.Utenti_Partite_idSquadraAToUtenti?.presidente
            const to =
              idSquadra ===
              calendario.Utenti_Partite_idSquadraHToUtenti?.idUtente
                ? calendario.Utenti_Partite_idSquadraAToUtenti?.mail
                : calendario.Utenti_Partite_idSquadraHToUtenti?.mail
            const htmlMessage = `Notifica automatica da erFantacalcio.com<br><br>
              Il tuo avversario ${avversario} ha inserito la formazione per la prossima partita<br>
              https://www.erfantacalcio.com<br><br>
              Saluti dal Vostro amato Presidente`

            if (to) await ReSendMailAsync(to, subject, htmlMessage)
            else {
              const presidenteWithoutMail =
                idSquadra ===
                calendario.Utenti_Partite_idSquadraHToUtenti?.idUtente
                  ? calendario.Utenti_Partite_idSquadraAToUtenti?.presidente
                  : calendario.Utenti_Partite_idSquadraHToUtenti?.presidente
              Logger.warn(
                `Impossibile inviare notifica, mail non configurata per il presidente: ${presidenteWithoutMail}`,
              )
            }
          }
        } else
          Logger.warn(
            `Calendario non trovato, impossibile procedere con l'inserimento della formazione`,
          )
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),
})

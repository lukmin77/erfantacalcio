import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { toLocaleDateTime } from '~/utils/dateUtils'
import { ReSendMailAsync } from '~/service/mailSender'
import { env } from 'process'
import { Formazioni, Partite, Voti } from '~/server/db/entities'
import { AppDataSource } from '~/data-source'
import { In } from 'typeorm'

export const create = protectedProcedure
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
      await AppDataSource.transaction(async (trx) => {
        const formazioniIds = await trx.find(Formazioni, {
          select: { idFormazione: true },
          where: { idPartita: idPartita, idSquadra: idSquadra },
        })
        await trx.delete(Voti, {
          idFormazione: In(formazioniIds.map((f) => f.idFormazione)),
        })
        await trx.delete(Formazioni, {
          idPartita: idPartita,
          idSquadra: idSquadra,
        })

        console.log(
          `Eliminazione voti e formazioni idPartita: ${idPartita} e idSquadra: ${idSquadra}`,
        )

        const partita = await trx.findOne(Partite,{
          select: {
            idCalendario: true,
            idPartita: true,
            UtentiSquadraH: {
              nomeSquadra: true,
              presidente: true,
              idUtente: true,
              mail: true,
            },
            UtentiSquadraA: {
              nomeSquadra: true,
              presidente: true,
              idUtente: true,
              mail: true,
            },
          },
          relations: {
            UtentiSquadraH: true,
            UtentiSquadraA: true,
          },
          where: { idPartita: idPartita },
        })
        console.log(
          `recupero idCalendario:${partita?.idCalendario} per idPartita: ${idPartita}`,
        )

        const formazione = await trx.insert(Formazioni,{
          idPartita: idPartita,
          idSquadra: idSquadra,
          modulo: modulo,
          dataOra: toLocaleDateTime(new Date()),
          hasBloccata: false,
        })
        console.log(
          `Creazione nuova formazione`,
          formazione.identifiers[0].idFormazione,
        )
        const idFormazione = formazione.identifiers[0].idFormazione

        if (partita) {
          await Promise.all(
            giocatori.map(async (c) => {
              await trx.insert(Voti,{
                idGiocatore: c.idGiocatore,
                idCalendario: partita.idCalendario,
                idFormazione: idFormazione,
                titolare: c.titolare,
                riserva: c.riserva,
                voto: 0,
              })
            }),
          )
          console.log(
            `Inseriti giocatori in tabella voti con idFormazione: ${idFormazione}`,
          )

          //invio mail
          if (env.MAIL_ENABLED) {
            const subject = `ErFantacalcio: Formazione partita ${partita.UtentiSquadraH?.nomeSquadra} - ${partita.UtentiSquadraA?.nomeSquadra}`
            const avversario =
              idSquadra === partita.UtentiSquadraH?.idUtente
                ? partita.UtentiSquadraH?.presidente
                : partita.UtentiSquadraA?.presidente
            const to =
              idSquadra === partita.UtentiSquadraH?.idUtente
                ? partita.UtentiSquadraA?.mail
                : partita.UtentiSquadraH?.mail
            const cc =
              idSquadra === partita.UtentiSquadraH?.idUtente
                ? partita.UtentiSquadraH?.mail
                : partita.UtentiSquadraA?.mail
            const htmlMessage = `Notifica automatica da erFantacalcio.com<br><br>
              Il tuo avversario ${avversario} ha inserito la formazione per la prossima partita<br>
              https://www.erfantacalcio.com<br><br>
              Saluti dal Vostro immenso Presidente`

            if (to && cc) await ReSendMailAsync(to, cc, subject, htmlMessage)
            else {
              const presidenteWithoutMail =
                idSquadra === partita.UtentiSquadraH?.idUtente
                  ? partita.UtentiSquadraA?.presidente
                  : partita.UtentiSquadraH?.presidente
              console.warn(
                `Impossibile inviare notifica, mail non configurata per il presidente: ${presidenteWithoutMail}`,
              )
            }
          }
        } else {
          console.warn(`Calendario non trovato, impossibile procedere con l'inserimento della formazione`)
        }
      })
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

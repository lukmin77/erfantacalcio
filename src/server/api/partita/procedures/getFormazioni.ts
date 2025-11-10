import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { mapCalendario } from '../../../utils/common'
import { toLocaleDateTime } from '~/utils/dateUtils'

export const getFormazioniProcedure = publicProcedure
  .input(z.object({ idPartita: z.number() }))
  .query(async (opts) => {
    const idPartita = +opts.input.idPartita
    try {
      const idCalendario = (
        await prisma.partite.findUnique({
          select: { Calendario: { select: { idCalendario: true } } },
          where: { idPartita },
        })
      )?.Calendario.idCalendario

      if (idCalendario) {
        const calendarioQry = await prisma.calendario.findUnique({
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
            hasDaRecuperare: true,
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
                Utenti_Partite_idSquadraHToUtenti: { select: { nomeSquadra: true, foto: true, maglia: true } },
                Utenti_Partite_idSquadraAToUtenti: { select: { nomeSquadra: true, foto: true, maglia: true } },
              },
              where: { idPartita },
            },
          },
          where: { idCalendario },
        })

        if (calendarioQry) {
          const calendario = (await mapCalendario([calendarioQry]))[0]
          if (calendario && calendario.partite.length === 1) {
            const partita = calendario.partite[0]
            const formazioni = await prisma.formazioni.findMany({
              select: {
                idFormazione: true,
                modulo: true,
                dataOra: true,
                idSquadra: true,
                Voti: {
                  select: {
                    titolare: true,
                    riserva: true,
                    Giocatori: {
                      select: {
                        idGiocatore: true,
                        nome: true,
                        nomeFantaGazzetta: true,
                        ruolo: true,
                        Trasferimenti: {
                          select: { SquadreSerieA: { select: { maglia: true, nome: true } } },
                          where: {
                            OR: [
                              { AND: [{ dataCessione: null }, { dataAcquisto: { lt: toLocaleDateTime(new Date()) } }] },
                              { AND: [ { NOT: { dataCessione: null } }, { dataAcquisto: { lt: toLocaleDateTime(new Date()) } }, { dataCessione: { gt: toLocaleDateTime(new Date()) } } ] },
                            ],
                          },
                        },
                      },
                    },
                  },
                  orderBy: [ { Giocatori: { ruolo: 'desc' } }, { riserva: 'asc' } ],
                },
              },
              where: {
                idPartita,
                OR: [ { idSquadra: partita?.idHome ?? 0 }, { idSquadra: partita?.idAway ?? 0 } ],
              },
            })

            const altrePartite = await prisma.partite.findMany({
              select: {
                idPartita: true,
                Utenti_Partite_idSquadraHToUtenti: { select: { nomeSquadra: true, foto: true, maglia: true } },
                Utenti_Partite_idSquadraAToUtenti: { select: { nomeSquadra: true, foto: true, maglia: true } },
              },
              where: { idCalendario },
            })

            return {
              Calendario: calendario,
              AltrePartite: altrePartite,
              FormazioneHome: formazioni.find((c) => c.idSquadra === partita?.idHome),
              FormazioneAway: formazioni.find((c) => c.idSquadra === partita?.idAway),
            }
          }
        }
      }
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

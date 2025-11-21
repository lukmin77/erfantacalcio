import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { getCalendario, mapCalendario } from '../../../utils/common'
import { toLocaleDateTime } from '~/utils/dateUtils'
import { Partite } from '~/server/db/entities'

export const getFormazioniProcedure = publicProcedure
  .input(z.object({ idPartita: z.number() }))
  .query(async (opts) => {
    const idPartita = +opts.input.idPartita
    try {
      const calendarioQry = await getCalendario({
        Partite: { idPartita: idPartita },
      })

      if (calendarioQry.length > 0) {
        const calendario = (await mapCalendario(calendarioQry)).pop()
        if (calendario) {
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
                        select: {
                          SquadreSerieA: {
                            select: { maglia: true, nome: true },
                          },
                        },
                        where: {
                          OR: [
                            {
                              AND: [
                                { dataCessione: null },
                                {
                                  dataAcquisto: {
                                    lt: toLocaleDateTime(new Date()),
                                  },
                                },
                              ],
                            },
                            {
                              AND: [
                                { NOT: { dataCessione: null } },
                                {
                                  dataAcquisto: {
                                    lt: toLocaleDateTime(new Date()),
                                  },
                                },
                                {
                                  dataCessione: {
                                    gt: toLocaleDateTime(new Date()),
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      },
                    },
                  },
                },
                orderBy: [{ Giocatori: { ruolo: 'desc' } }, { riserva: 'asc' }],
              },
            },
            where: {
              idPartita,
              OR: [
                { idSquadra: partita?.idHome ?? 0 },
                { idSquadra: partita?.idAway ?? 0 },
              ],
            },
          })

          const altrePartite = await Partite.find({
            select: {
              idPartita: true,
              UtentiSquadraH: {
                nomeSquadra: true,
                foto: true,
                maglia: true,
              },
              UtentiSquadraA: {
                nomeSquadra: true,
                foto: true,
                maglia: true,
              },
            },
            relations: { UtentiSquadraH: true, UtentiSquadraA: true },
            where: { idCalendario },
          })

          return {
            Calendario: calendario,
            AltrePartite: altrePartite,
            FormazioneHome: formazioni.find(
              (c) => c.idSquadra === partita?.idHome,
            ),
            FormazioneAway: formazioni.find(
              (c) => c.idSquadra === partita?.idAway,
            ),
          }
        }
      }
    } catch (error) {
      console.error('Si è verificato un errore', error)
      throw error
    }
  })

import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { getCalendario, mapCalendario } from '../../../utils/common'
import { toLocaleDateTime } from '~/utils/dateUtils'
import { Formazioni, Partite } from '~/server/db/entities'

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
          
            const formazioni = await Formazioni.createQueryBuilder('formazione')
              .leftJoinAndSelect('formazione.Voti', 'voti')
              .leftJoinAndSelect('voti.Giocatori', 'giocatore')
              .leftJoinAndSelect('giocatore.Trasferimenti', 'trasf')
              .leftJoinAndSelect('trasf.SquadreSerieA', 'squadra')
              .where('formazione.idPartita = :idPartita', { idPartita })
              .andWhere('formazione.idSquadra IN (:...ids)', {
                ids: [partita?.idHome ?? 0, partita?.idAway ?? 0],
              })
              // replicate the commented complex where (filtering transfers by date)
              .andWhere(
                `(
              (trasf.dataCessione IS NULL AND trasf.dataAcquisto < :now)
              OR
              (trasf.dataCessione IS NOT NULL AND trasf.dataAcquisto < :now AND trasf.dataCessione > :now)
              )`,
                { now: toLocaleDateTime(new Date()) },
              )
              .orderBy('giocatore.ruolo', 'DESC')
              .addOrderBy('voti.riserva', 'ASC')
              .getMany()

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
            where: { idCalendario: calendario.idCalendario },
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

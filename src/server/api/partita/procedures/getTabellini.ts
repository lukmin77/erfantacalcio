import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { publicProcedure } from '~/server/api/trpc'
import { z } from 'zod'
import { getCalendario, mapCalendario } from '../../../utils/common'
import { toLocaleDateTime } from '~/utils/dateUtils'
import { getBonusModulo, getBonusSenzaVoto, getGiocatoriVotoInfluente, getGolSegnati, getTabellino } from '../../../utils/common'
import { Configurazione } from '~/config'

export const getTabelliniProcedure = publicProcedure
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
        const calendario = await getCalendario({
          idCalendario: idCalendario,
          Partite: { idPartita: idPartita },
        })

        if (calendario) {
          const result = (await mapCalendario(calendario))[0]
          if (result && result.partite.length === 1) {
            const partita = result.partite[0]
            const formazioni = await prisma.formazioni.findMany({
              select: {
                idFormazione: true,
                modulo: true,
                dataOra: true,
                idSquadra: true,
                Voti: {
                  select: {
                    idVoto: true,
                    titolare: true,
                    riserva: true,
                    voto: true,
                    ammonizione: true,
                    espulsione: true,
                    gol: true,
                    assist: true,
                    autogol: true,
                    altriBonus: true,
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

            const datiHome = formazioni.find((c) => c.idSquadra === partita?.idHome)
            const datiAway = formazioni.find((c) => c.idSquadra === partita?.idAway)

            const giocatoriInfluentiHome = await getTabellino(datiHome?.idFormazione ?? 0)
            const fantapuntiHome = getGiocatoriVotoInfluente(giocatoriInfluentiHome).reduce((acc, cur) => acc + (cur.votoBonus ?? 0), 0)
            const giocatoriInfluentiAway = await getTabellino(datiAway?.idFormazione ?? 0)
            const fantapuntiAway = getGiocatoriVotoInfluente(giocatoriInfluentiAway).reduce((acc, cur) => acc + (cur.votoBonus ?? 0), 0)

            const altrePartite = await prisma.partite.findMany({
              select: {
                idPartita: true,
                Utenti_Partite_idSquadraHToUtenti: { select: { nomeSquadra: true, foto: true, maglia: true } },
                Utenti_Partite_idSquadraAToUtenti: { select: { nomeSquadra: true, foto: true, maglia: true } },
              },
              where: { idCalendario },
            })

            return {
              Calendario: result,
              AltrePartite: altrePartite,
              TabellinoHome: datiHome && {
                dataOra: datiHome?.dataOra,
                modulo: datiHome?.modulo,
                idSquadra: datiHome?.idSquadra,
                fattoreCasalingo: partita?.isFattoreHome === true ? Configurazione.bonusFattoreCasalingo : 0,
                bonusModulo: getBonusModulo(datiHome.modulo),
                bonusSenzaVoto: getBonusSenzaVoto(getGiocatoriVotoInfluente(giocatoriInfluentiHome).length),
                fantapunti: fantapuntiHome,
                golSegnati: getGolSegnati(
                  fantapuntiHome +
                    getBonusModulo(datiHome.modulo) +
                    getBonusSenzaVoto(getGiocatoriVotoInfluente(giocatoriInfluentiHome).length) +
                    (partita?.isFattoreHome === true ? Configurazione.bonusFattoreCasalingo : 0),
                ),
                fantapuntiTotale:
                  fantapuntiHome +
                  getBonusModulo(datiHome.modulo) +
                  getBonusSenzaVoto(getGiocatoriVotoInfluente(giocatoriInfluentiHome).length) +
                  (partita?.isFattoreHome === true ? Configurazione.bonusFattoreCasalingo : 0),
                Voti: datiHome.Voti.map((c) => ({
                  nome: c.Giocatori.nome,
                  idGiocatore: c.Giocatori.idGiocatore,
                  titolare: c.titolare,
                  riserva: c.riserva,
                  nomeSquadraSerieA: c.Giocatori.Trasferimenti[0]?.SquadreSerieA?.nome,
                  magliaSquadraSerieA: c.Giocatori.Trasferimenti[0]?.SquadreSerieA?.maglia,
                  ruolo: c.Giocatori.ruolo,
                  voto: c.voto?.toNumber() ?? 0,
                  ammonizione: c.ammonizione.toNumber() ?? 0,
                  espulsione: c.espulsione.toNumber() ?? 0,
                  gol: c.gol?.toNumber() ?? 0,
                  assist: c.assist?.toNumber() ?? 0,
                  autogol: c.autogol?.toNumber() ?? 0,
                  altriBonus: c.altriBonus?.toNumber() ?? 0,
                  votoBonus: giocatoriInfluentiHome.find((gi) => gi.idVoto === c.idVoto)?.votoBonus ?? 0,
                  isSostituito: giocatoriInfluentiHome.find((gi) => gi.idVoto === c.idVoto)?.isSostituito ?? false,
                  isVotoInfluente: giocatoriInfluentiHome.find((gi) => gi.idVoto === c.idVoto)?.isVotoInfluente ?? false,
                })),
              },
              TabellinoAway: datiAway && {
                dataOra: datiAway?.dataOra,
                modulo: datiAway?.modulo,
                idSquadra: datiAway?.idSquadra,
                fattoreCasalingo: 0,
                bonusModulo: getBonusModulo(datiAway.modulo),
                bonusSenzaVoto: getBonusSenzaVoto(getGiocatoriVotoInfluente(giocatoriInfluentiAway).length),
                fantapunti: fantapuntiAway,
                golSegnati: getGolSegnati(
                  fantapuntiAway +
                    getBonusModulo(datiAway.modulo) +
                    getBonusSenzaVoto(getGiocatoriVotoInfluente(giocatoriInfluentiAway).length),
                ),
                fantapuntiTotale:
                  fantapuntiAway +
                  getBonusModulo(datiAway.modulo) +
                  getBonusSenzaVoto(getGiocatoriVotoInfluente(giocatoriInfluentiAway).length),
                Voti: datiAway.Voti.map((c) => ({
                  nome: c.Giocatori.nome,
                  idGiocatore: c.Giocatori.idGiocatore,
                  titolare: c.titolare,
                  riserva: c.riserva,
                  nomeSquadraSerieA: c.Giocatori.Trasferimenti[0]?.SquadreSerieA?.nome,
                  magliaSquadraSerieA: c.Giocatori.Trasferimenti[0]?.SquadreSerieA?.maglia,
                  ruolo: c.Giocatori.ruolo,
                  voto: c.voto?.toNumber() ?? 0,
                  ammonizione: c.ammonizione.toNumber() ?? 0,
                  espulsione: c.espulsione.toNumber() ?? 0,
                  gol: c.gol?.toNumber() ?? 0,
                  assist: c.assist?.toNumber() ?? 0,
                  autogol: c.autogol?.toNumber() ?? 0,
                  altriBonus: c.altriBonus?.toNumber() ?? 0,
                  votoBonus: giocatoriInfluentiAway.find((gi) => gi.idVoto === c.idVoto)?.votoBonus ?? 0,
                  isSostituito: giocatoriInfluentiAway.find((gi) => gi.idVoto === c.idVoto)?.isSostituito ?? false,
                  isVotoInfluente: giocatoriInfluentiAway.find((gi) => gi.idVoto === c.idVoto)?.isVotoInfluente ?? false,
                })),
              },
            }
          }
        }
      }
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

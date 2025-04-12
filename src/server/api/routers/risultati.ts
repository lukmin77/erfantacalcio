import Logger from '~/lib/logger.server'
import { z } from 'zod'
import { Configurazione } from '~/config'
import {
  getTorneo,
  getDescrizioneTorneo,
  getTorneoTitle,
  getTorneoSubTitle,
  getBonusModulo,
  getGiocatoriVotoInfluente,
  getBonusSenzaVoto,
  getGolSegnati,
  getTabellino,
  partitaSchema,
} from './common'
import { RuoloUtente } from '~/utils/enums'

import prisma from '~/utils/db'

import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from '~/server/api/trpc'

export const risultatiRouter = createTRPCRouter({
  update: adminProcedure
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
    }),

  getGiornataPartite: publicProcedure
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
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true },
            },
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
                  select: { nomeSquadra: true, foto: true },
                },
                Utenti_Partite_idSquadraAToUtenti: {
                  select: { nomeSquadra: true, foto: true },
                },
              },
            },
          },
          where: {
            idCalendario: opts.input.idCalendario,
          },
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
    }),

  getTabellino: adminProcedure
    .input(
      z.object({
        idPartita: z.number(),
        idSquadra: z.number().nullable(),
      }),
    )
    .query(async (opts) => {
      try {
        if (opts.input.idSquadra) {
          const resultFormazione = await getFormazione(
            opts.input.idPartita,
            opts.input.idSquadra,
          )
          if (resultFormazione) {
            const giocatoriInfluenti = await getTabellino(
              resultFormazione.idFormazione,
            )

            if (giocatoriInfluenti) {
              const fantapunti = getGiocatoriVotoInfluente(
                giocatoriInfluenti,
              ).reduce((acc, cur) => acc + (cur.votoBonus ?? 0), 0)
              return {
                idPartita: opts.input.idPartita,
                idSquadra: opts.input.idSquadra,
                fantapunti: fantapunti,
                fattoreCasalingo: Configurazione.bonusFattoreCasalingo,
                bonusModulo: getBonusModulo(resultFormazione.modulo),
                giocatoriInfluenti:
                  getGiocatoriVotoInfluente(giocatoriInfluenti).length,
                bonusSenzaVoto: getBonusSenzaVoto(
                  getGiocatoriVotoInfluente(giocatoriInfluenti).length,
                ),
                golSegnati: getGolSegnati(fantapunti),
              }
            }
          } else {
            const msg = `Nessuna formazione per la partita: ${opts.input.idPartita} e l'idsquadra: ${opts.input.idSquadra}`
            Logger.info(msg)
            return msg
          }
        } else {
          const msg = `Nessuna squadra assegnata alla partita: ${opts.input.idPartita}`
          Logger.warn(msg)
          return msg
        }
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),
})

async function getFormazione(idPartita: number, idSquadra: number) {
  return await prisma.formazioni.findFirst({
    select: { idFormazione: true, modulo: true },
    where: {
      idPartita: idPartita,
      idSquadra: idSquadra,
    },
  })
}

function mapPartite(
  partite: z.infer<typeof partitaSchema>[],
  includeTabellini: boolean,
  backOfficeMode: boolean,
) {
  return Promise.all(
    partite.map(async (p) => {
      Logger.info(`IdPartita: ${p.idPartita}`)

      const formazioneHome = await getFormazione(p.idPartita, p.idSquadraH ?? 0)
      const formazioneAway = await getFormazione(p.idPartita, p.idSquadraA ?? 0)
      const tabellinoHome =
        includeTabellini && formazioneHome?.idFormazione
          ? await getTabellino(formazioneHome?.idFormazione)
          : []
      const tabellinoAway =
        includeTabellini && formazioneAway?.idFormazione
          ? await getTabellino(formazioneAway?.idFormazione)
          : []
      const fantapuntiHome = includeTabellini
        ? getGiocatoriVotoInfluente(tabellinoHome).reduce(
            (acc, cur) => acc + (cur.votoBonus ?? 0),
            0,
          )
        : 0
      const fantapuntiAway = includeTabellini
        ? getGiocatoriVotoInfluente(tabellinoAway).reduce(
            (acc, cur) => acc + (cur.votoBonus ?? 0),
            0,
          )
        : 0
      const bonusModuloHome =
        includeTabellini && fantapuntiHome > 0
          ? getBonusModulo(formazioneHome?.modulo ?? '')
          : 0
      const bonusModuloAway =
        includeTabellini && fantapuntiAway > 0
          ? getBonusModulo(formazioneAway?.modulo ?? '')
          : 0
      const bonusSenzaVotoHome =
        includeTabellini && fantapuntiHome > 0
          ? getBonusSenzaVoto(getGiocatoriVotoInfluente(tabellinoHome).length)
          : 0
      const bonusSenzaVotoAway =
        includeTabellini && fantapuntiAway > 0
          ? getBonusSenzaVoto(getGiocatoriVotoInfluente(tabellinoAway).length)
          : 0
      const totaleFantapuntiHome =
        includeTabellini && fantapuntiHome > 0
          ? fantapuntiHome +
            bonusModuloHome +
            bonusSenzaVotoHome +
            (p.fattoreCasalingo && fantapuntiHome > 0
              ? Configurazione.bonusFattoreCasalingo
              : 0)
          : 0
      const totaleFantapuntiAway =
        includeTabellini && fantapuntiAway > 0
          ? fantapuntiAway + bonusModuloAway + bonusSenzaVotoAway
          : 0
      const golSegnatiHome =
        includeTabellini && backOfficeMode && fantapuntiHome > 0
          ? getGolSegnati(totaleFantapuntiHome)
          : 0
      const golSegnatiAway =
        includeTabellini && backOfficeMode && fantapuntiAway > 0
          ? getGolSegnati(totaleFantapuntiAway)
          : 0

      return {
        idPartita: p.idPartita,
        escludi: false,
        //Home
        idFormazioneHome: formazioneHome?.idFormazione,
        idHome: p.idSquadraH,
        isFattoreHome: p.fattoreCasalingo,
        fattoreCasalingo: Configurazione.bonusFattoreCasalingo,
        squadraHome: p.Utenti_Partite_idSquadraHToUtenti?.nomeSquadra,
        fotoHome: p.Utenti_Partite_idSquadraHToUtenti?.foto,
        multaHome: p.hasMultaH,
        golHome: p.golH,
        tabellinoHome: tabellinoHome,
        bonusModuloHome: bonusModuloHome,
        bonusSenzaVotoHome: bonusSenzaVotoHome,
        fantapuntiHome: fantapuntiHome,
        calcoloGolSegnatiHome: golSegnatiHome,
        totaleFantapuntiHome: totaleFantapuntiHome,
        //Away
        idFormazioneAway: formazioneAway?.idFormazione,
        idAway: p.idSquadraA,
        squadraAway: p.Utenti_Partite_idSquadraAToUtenti?.nomeSquadra,
        fotoAway: p.Utenti_Partite_idSquadraAToUtenti?.foto,
        multaAway: p.hasMultaA,
        golAway: p.golA,
        tabellinoAway: tabellinoAway,
        bonusModuloAway: bonusModuloAway,
        bonusSenzaVotoAway: bonusSenzaVotoAway,
        fantapuntiAway: fantapuntiAway,
        calcoloGolSegnatiAway: golSegnatiAway,
        totaleFantapuntiAway: totaleFantapuntiAway,
      }
    }),
  )
}

async function UpdateClassifica(idSquadra: number, idTorneo: number) {
  const puntiH =
    (
      await prisma.partite.aggregate({
        _sum: { puntiH: true },
        where: {
          AND: [
            { Calendario: { idTorneo: idTorneo } },
            { idSquadraH: idSquadra },
            { hasMultaH: false },
          ],
        },
      })
    )._sum.puntiH ?? 0
  const vinteH = await prisma.partite.count({
    where: {
      idSquadraH: idSquadra,
      golH: { gt: prisma.partite.fields.golA },
      Calendario: {
        idTorneo: idTorneo,
      },
    },
  })
  const nulleH = await prisma.partite.count({
    where: {
      idSquadraH: idSquadra,
      golH: { equals: prisma.partite.fields.golA },
      Calendario: {
        idTorneo: idTorneo,
      },
    },
  })
  const perseH = await prisma.partite.count({
    where: {
      idSquadraH: idSquadra,
      golH: { lt: prisma.partite.fields.golA },
      Calendario: {
        idTorneo: idTorneo,
      },
    },
  })
  const puntiA =
    (
      await prisma.partite.aggregate({
        _sum: { puntiA: true },
        where: {
          AND: [
            { Calendario: { idTorneo: idTorneo } },
            { idSquadraA: idSquadra },
            { hasMultaA: false },
          ],
        },
      })
    )._sum.puntiA ?? 0
  const vinteA = await prisma.partite.count({
    where: {
      idSquadraA: idSquadra,
      golA: { gt: prisma.partite.fields.golH },
      Calendario: {
        idTorneo: idTorneo,
      },
    },
  })
  const nulleA = await prisma.partite.count({
    where: {
      idSquadraA: idSquadra,
      golH: { equals: prisma.partite.fields.golA },
      Calendario: {
        idTorneo: idTorneo,
      },
    },
  })
  const perseA = await prisma.partite.count({
    where: {
      idSquadraA: idSquadra,
      golA: { lt: prisma.partite.fields.golH },
      Calendario: {
        idTorneo: idTorneo,
      },
    },
  })

  const golFattiH =
    (
      await prisma.partite.aggregate({
        _sum: { golH: true },
        where: {
          AND: [
            { Calendario: { idTorneo: idTorneo } },
            { idSquadraH: idSquadra },
          ],
        },
      })
    )._sum.golH ?? 0
  const golSubitiH =
    (
      await prisma.partite.aggregate({
        _sum: { golA: true },
        where: {
          AND: [
            { Calendario: { idTorneo: idTorneo } },
            { idSquadraH: idSquadra },
          ],
        },
      })
    )._sum.golA ?? 0
  const golFattiA =
    (
      await prisma.partite.aggregate({
        _sum: { golA: true },
        where: {
          AND: [
            { Calendario: { idTorneo: idTorneo } },
            { idSquadraA: idSquadra },
          ],
        },
      })
    )._sum.golA ?? 0
  const golSubitiA =
    (
      await prisma.partite.aggregate({
        _sum: { golH: true },
        where: {
          AND: [
            { Calendario: { idTorneo: idTorneo } },
            { idSquadraA: idSquadra },
          ],
        },
      })
    )._sum.golH ?? 0

  const giocate = await prisma.partite.count({
    where: {
      Calendario: {
        AND: [{ idTorneo: idTorneo }, { hasGiocata: true }],
      },
      OR: [{ idSquadraA: idSquadra }, { idSquadraH: idSquadra }],
    },
  })

  const multeH = await prisma.partite.count({
    where: {
      idSquadraH: idSquadra,
      hasMultaH: true,
      Calendario: { idTorneo: idTorneo },
    },
  })

  const multeA = await prisma.partite.count({
    where: {
      idSquadraA: idSquadra,
      hasMultaA: true,
      Calendario: { idTorneo: idTorneo },
    },
  })

  await prisma.classifiche.updateMany({
    data: {
      punti: puntiH + puntiA,
      vinteCasa: vinteH,
      pareggiCasa: nulleH,
      perseCasa: perseH,
      vinteTrasferta: vinteA,
      pareggiTrasferta: nulleA,
      perseTrasferta: perseA,
      golFatti: golFattiH + golFattiA,
      golSubiti: golSubitiH + golSubitiA,
      differenzaReti: golFattiH + golFattiA - (golSubitiH + golSubitiA),
      giocate: giocate,
    },
    where: {
      idSquadra: idSquadra,
      idTorneo: idTorneo,
    },
  })
  await prisma.utenti.update({
    data: {
      importoMulte: (multeH + multeA) * Configurazione.importoMulta,
    },
    where: { idUtente: idSquadra },
  })
}

function getPunti(
  hasClassifica: boolean,
  multa: boolean,
  gol1: number,
  gol2: number,
): number {
  return hasClassifica
    ? multa
      ? 0
      : gol1 > gol2
        ? 3
        : gol1 === gol2
          ? 1
          : 0
    : 0
}

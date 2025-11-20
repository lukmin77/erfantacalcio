import Logger from '~/lib/logger.server'
import prisma from '~/utils/db'
import { toLocaleDateTime } from '~/utils/dateUtils'
import { Configurazione } from '~/config'
import { getCalendario } from '../../../utils/common'
import { type Partita, RoundRobin4, RoundRobin8 } from '~/utils/bergerTables'
import { FlowNewSeason } from '~/server/db/entities'

export async function updateFase(idFase: number) {
  await FlowNewSeason.update(
    { idFase },
    { active: true, data: toLocaleDateTime(new Date()) },
  )
}

export async function creaPartite(
  squadre: number,
  idTorneo: number,
  evaluateLastGirone: boolean,
  idAccumulate = 0,
) {
  let roundRobin: Partita[] | undefined

  if (squadre === 8) {
    roundRobin = RoundRobin8()
    Logger.info('creato roundrobin 8 squadre')
  } else if (squadre === 4) {
    roundRobin = RoundRobin4()
    Logger.info('creato roundrobin 4 squadre')
  } else {
    Logger.error('Numero di squadre non supportato')
    throw new Error('Numero di squadre non supportato')
  }

  const calendario = await getCalendario({ idTorneo: idTorneo })
  if (calendario && roundRobin) {
    let index = 1
    let previousGirone = calendario[0]?.girone
    const lastGirone = calendario[calendario.length - 1]?.girone
    Logger.info(`lastGirone: ${lastGirone}, evaluateLastGirone: ${evaluateLastGirone}`)

    for (const c of calendario) {
      if (c.girone !== previousGirone) {
        previousGirone = c.girone!
        index = 1
      }

      const matches = roundRobin.filter((x) => x.giornata === index)
      Logger.info(`Matches for girone ${c.girone}:`, matches)

      for (const p of matches) {
        let fattoreCasalingo = Configurazione.bonusFattoreCasalingo > 0
        if (evaluateLastGirone && lastGirone === c.girone && fattoreCasalingo) {
          fattoreCasalingo = (calendario[calendario.length - 1]?.girone ?? 0) % 2 === 0
          Logger.info(`Fattore casalingo per l'ultima giornata: ${fattoreCasalingo}`)
        }

        await prisma.partite.createMany({
          data: [
            {
              idCalendario: c.idCalendario,
              idSquadraH: c.girone! % 2 === 0 ? p.squadraHome + idAccumulate : p.squadraAway + idAccumulate,
              idSquadraA: c.girone! % 2 === 0 ? p.squadraAway + idAccumulate : p.squadraHome + idAccumulate,
              fattoreCasalingo,
              golH: null,
              golA: null,
              hasMultaH: false,
              hasMultaA: false,
              punteggioH: null,
              punteggioA: null,
              puntiH: null,
              puntiA: null,
            },
          ],
        })
      }

      index++
    }

    Logger.info(`create partite calendario per idTorneo: ${idTorneo}`)
  }
}

export async function creaClassifica(idTorneo: number, from: number, to: number) {
  const squadreData = []
  for (let i = from; i <= to; i++) {
    squadreData.push({
      idSquadra: i,
      idTorneo,
      differenzaReti: 0,
      giocate: 0,
      golFatti: 0,
      golSubiti: 0,
      pareggiCasa: 0,
      pareggiTrasferta: 0,
      perseCasa: 0,
      perseTrasferta: 0,
      punti: 0,
      vinteCasa: 0,
      vinteTrasferta: 0,
    })
  }
  await prisma.classifiche.createMany({ data: squadreData })
  Logger.info(`create classifiche per idTorneo: ${idTorneo}`)
}

export async function creaPartiteEmpty(partite: number, idTorneo: number, fattoreCasalingo: boolean) {
  const calendario = await getCalendario({ idTorneo: idTorneo })
  if (calendario?.[0]) {
    for (let i = 0; i < partite; i++) {
      await prisma.partite.createMany({
        data: [
          {
            idCalendario: calendario[0]?.idCalendario,
            idSquadraH: null,
            idSquadraA: null,
            fattoreCasalingo,
            golH: null,
            golA: null,
            hasMultaH: false,
            hasMultaA: false,
            punteggioH: null,
            punteggioA: null,
            puntiH: null,
            puntiA: null,
          },
        ],
      })
    }
    Logger.info(`create partite calendario per idTorneo: ${idTorneo}`)
  }
}

export async function checkVotiUltimaGiornata() {
  return (
    (await prisma.voti.count({
      where: { Calendario: { giornataSerieA: 38 } },
    })) > 0
  )
}

export async function checkCountPartite() {
  return (await prisma.partite.count()) === 0
}

export async function checkCountClassifiche() {
  return (await prisma.classifiche.count()) === 0
}

export async function checkVerificaPartiteGiocate() {
  return (
    (await prisma.calendario.count({
      where: { AND: [{ hasGiocata: false }, { idTorneo: { lte: 6 } }] },
    })) === 0
  )
}

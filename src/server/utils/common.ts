import { Configurazione } from '~/config'
import Logger from '~/lib/logger.server'
import { getRuoloEsteso, normalizeCampioncinoUrl } from '~/utils/helper'
import { toLocaleDateTime } from '~/utils/dateUtils'
import { toNumberWithPrecision } from '~/utils/numberUtils'
import { type GiocatoreType } from '~/types/squadre'
import { type Decimal } from '@prisma/client/runtime/library'

import prisma from '~/utils/db'
import { z } from 'zod'
import { giornataSchema, serieASchema } from '~/schemas/calendario/schema'
import { partitaSchema } from "~/schemas/calendario/schema"
import { calendarioPartiteSchema } from '~/schemas/calendario/schema'

type CalendarioFilter =
  | { idTorneo: number }
  | { Tornei: { gruppoFase: { not: null } } }

export async function chiudiTrasferimentoGiocatore(
  idGiocatore: number,
  chiusuraStagione: boolean,
) {
  try {
    //cerca il trasferimento ancora in corso per quel giocatore (datacessione is null)
    const oldTrasferimento = await prisma.trasferimenti.findFirst({
      select: {
        dataAcquisto: true,
        idTrasferimento: true,
        Utenti: { select: { nomeSquadra: true, idUtente: true } },
        SquadreSerieA: { select: { nome: true } },
        Giocatori: { select: { ruolo: true } },
      },
      where: {
        AND: [{ idGiocatore: idGiocatore }, { dataCessione: null }],
      },
    })

    if (oldTrasferimento) {
      Logger.debug(
        'dati ultimo trasferimento idgiocatore: ' + idGiocatore,
        oldTrasferimento,
      )
      //cerca i voti nel periodo dall'ultima data di acuisto ad oggi
      const voti = await prisma.voti.findMany({
        select: {
          voto: true,
          gol: true,
          assist: true, //idVoto: true,
          Calendario: {
            select: {
              giornataSerieA: true, //, giornata: true, idTorneo: true
            },
          },
        },
        distinct: ['voto', 'gol', 'assist'],
        where: {
          AND: [
            { idGiocatore: idGiocatore },
            { Calendario: { data: { lte: toLocaleDateTime(new Date()) } } },
            { Calendario: { data: { gte: oldTrasferimento.dataAcquisto } } },
            { Giocatori: { Trasferimenti: { some: { dataCessione: null } } } },
            { voto: { not: 0 } },
            { voto: { not: null } },
          ],
        },
      })

      if (voti.length > 0) {
        Logger.debug(
          'voti ultimo trasferimento idgiocatore: ' + idGiocatore,
          voti,
        )
        //sui voti precedentemente trovati calcolo media, gol, assist e giocate
        const oldStatistica = voti.reduce(
          (acc, curr) => {
            acc.mediaVoto += toNumberWithPrecision(curr.voto, 2)
            acc.golTotali += curr.gol?.toNumber() ?? 0
            acc.assistTotali += curr.assist?.toNumber() ?? 0
            acc.giocate = voti.length
            return acc
          },
          { mediaVoto: 0, golTotali: 0, assistTotali: 0, giocate: 0 },
        )
        oldStatistica.mediaVoto = oldStatistica.mediaVoto / voti.length
        oldStatistica.golTotali =
          oldTrasferimento.Giocatori.ruolo === 'P'
            ? oldStatistica.golTotali
            : oldStatistica.golTotali / 3

        Logger.debug(
          'statistica ultimo trasferimento idgiocatore: ' + idGiocatore,
          oldStatistica,
        )

        Logger.debug('updating ultimo trasferimento (completo): ' + idGiocatore)
        //eseguo update del trasferimento con datacessione odierna
        await prisma.trasferimenti.update({
          data: {
            dataCessione: new Date(),
            nomeSquadraSerieA: oldTrasferimento.SquadreSerieA?.nome,
            nomeSquadra: oldTrasferimento.Utenti?.nomeSquadra,
            media: oldStatistica.mediaVoto,
            gol: oldStatistica.golTotali,
            assist: oldStatistica.assistTotali,
            giocate: oldStatistica.giocate,
            idSquadra: chiusuraStagione
              ? null
              : oldTrasferimento.Utenti?.idUtente,
          },
          where: {
            idTrasferimento: oldTrasferimento.idTrasferimento,
          },
        })
        Logger.debug('updated ultimo trasferimento (completo): ' + idGiocatore)
      } else {
        Logger.debug('updating ultimo trasferimento (parziale): ' + idGiocatore)
        //eseguo update del trasferimento con datacessione odierna
        await prisma.trasferimenti.update({
          data: {
            dataCessione: new Date(),
            nomeSquadraSerieA: oldTrasferimento.SquadreSerieA?.nome,
            nomeSquadra: oldTrasferimento.Utenti?.nomeSquadra,
            idSquadra: chiusuraStagione
              ? null
              : oldTrasferimento.Utenti?.idUtente,
          },
          where: {
            idTrasferimento: oldTrasferimento.idTrasferimento,
          },
        })
        Logger.debug('updated ultimo trasferimento (parziale): ' + idGiocatore)
      }
    } else {
      Logger.debug('updating ultimo trasferimento (base): ' + idGiocatore)
      //eseguo update del trasferimento con datacessione odierna
      await prisma.trasferimenti.updateMany({
        data: {
          dataCessione: new Date(),
          nomeSquadra: '',
          nomeSquadraSerieA: '',
        },
        where: {
          AND: [{ idGiocatore: idGiocatore }, { dataCessione: null }],
        },
      })
      Logger.debug('updated ultimo trasferimento (base): ' + idGiocatore)
    }
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

export async function getProssimaGiornataSerieA(
  isGiocata: boolean,
  orderType: 'asc' | 'desc',
) {
  const query = await prisma.calendario.findFirst({
    select: {
      giornataSerieA: true,
    },
    where: {
      AND: [
        { hasGiocata: isGiocata },
        { giornata: { gt: 0 } },
        { girone: { gt: 0 } },
      ],
    },
    orderBy: {
      ordine: orderType,
    },
  })
  return query?.giornataSerieA ?? 0
}

export async function getProssimaGiornata(
  giornataSerieA: number,
  withSerieA?: boolean,
) {
  const result = await prisma.calendario.findMany({
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
            select: { nomeSquadra: true, foto: true, maglia: true },
          },
          Utenti_Partite_idSquadraAToUtenti: {
            select: { nomeSquadra: true, foto: true, maglia: true },
          },
        },
      },
    },
    where: {
      AND: [{ giornataSerieA: giornataSerieA }, { hasGiocata: false }],
    },
    orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }],
  })

  if (withSerieA && withSerieA === true) {
    const serieAData = await prisma.serieA.findMany({
      select: {
        giornata: true,
        squadraHome: true,
        squadraAway: true,
      },
      where: { giornata: giornataSerieA },
    })
    return mapCalendarioWithSerieA(result, serieAData)
  } else {
    return mapCalendario(result)
  }
}

export async function getRosaDisponibile(idSquadra: number) {
  const query = await prisma.trasferimenti.findMany({
    select: {
      idGiocatore: true,
      costo: true,
      Giocatori: {
        select: { nome: true, nomeFantaGazzetta: true, ruolo: true },
      },
      SquadreSerieA: {
        select: { nome: true, maglia: true },
      },
    },
    where: {
      AND: [
        { idSquadra: idSquadra },
        { stagione: Configurazione.stagione },
        { hasRitirato: false },
        {
          OR: [
            {
              AND: [
                { dataCessione: null },
                { dataAcquisto: { lt: toLocaleDateTime(new Date()) } },
              ],
            },
            {
              AND: [
                { dataCessione: null },
                { dataAcquisto: { lt: toLocaleDateTime(new Date()) } },
                { dataCessione: { gt: toLocaleDateTime(new Date()) } },
              ],
            },
          ],
        },
      ],
    },
    orderBy: [
      { Giocatori: { ruolo: 'desc' } },
      { costo: 'desc' },
      { Giocatori: { nome: 'asc' } },
    ],
  })

  return query.map<GiocatoreType>((giocatore) => ({
    idGiocatore: giocatore.idGiocatore,
    nome: giocatore.Giocatori.nome,
    nomeFantagazzetta: giocatore.Giocatori.nomeFantaGazzetta,
    ruolo: giocatore.Giocatori.ruolo,
    ruoloEsteso: getRuoloEsteso(giocatore.Giocatori.ruolo),
    costo: giocatore.costo,
    isVenduto: false,
    urlCampioncino: normalizeCampioncinoUrl(
      Configurazione.urlCampioncino,
      giocatore.Giocatori.nome,
      giocatore.Giocatori.nomeFantaGazzetta,
    ),
    urlCampioncinoSmall: normalizeCampioncinoUrl(
      Configurazione.urlCampioncinoSmall,
      giocatore.Giocatori.nome,
      giocatore.Giocatori.nomeFantaGazzetta,
    ),
    nomeSquadraSerieA: giocatore.SquadreSerieA?.nome,
    magliaSquadraSerieA: giocatore.SquadreSerieA?.maglia,
  }))
}

export async function getGiocatoriVenduti(idSquadra: number) {
  const query = await prisma.trasferimenti.findMany({
    select: {
      idGiocatore: true,
      costo: true,
      Giocatori: {
        select: { nome: true, nomeFantaGazzetta: true, ruolo: true },
      },
      SquadreSerieA: {
        select: { nome: true, maglia: true },
      },
    },
    where: {
      AND: [
        { idSquadra: idSquadra },
        { stagione: Configurazione.stagione },
        { hasRitirato: false },
        { NOT: { dataCessione: null } },
      ],
    },
    orderBy: [
      { Giocatori: { ruolo: 'desc' } },
      { costo: 'desc' },
      { Giocatori: { nome: 'asc' } },
    ],
  })

  return query.map<GiocatoreType>((giocatore) => ({
    idGiocatore: giocatore.idGiocatore,
    nome: giocatore.Giocatori.nome,
    nomeFantagazzetta: giocatore.Giocatori.nomeFantaGazzetta,
    ruolo: giocatore.Giocatori.ruolo,
    ruoloEsteso: getRuoloEsteso(giocatore.Giocatori.ruolo),
    costo: giocatore.costo,
    isVenduto: true,
    urlCampioncino: normalizeCampioncinoUrl(
      Configurazione.urlCampioncino,
      giocatore.Giocatori.nome,
      giocatore.Giocatori.nomeFantaGazzetta,
    ),
    urlCampioncinoSmall: normalizeCampioncinoUrl(
      Configurazione.urlCampioncinoSmall,
      giocatore.Giocatori.nome,
      giocatore.Giocatori.nomeFantaGazzetta,
    ),
    nomeSquadraSerieA: giocatore.SquadreSerieA?.nome,
    magliaSquadraSerieA: giocatore.SquadreSerieA?.maglia,
  }))
}

export async function deleteVotiGiocatore(idGiocatore: number) {
  try {
    await prisma.voti.deleteMany({
      where: {
        idGiocatore: idGiocatore,
      },
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

export async function deleteGiocatore(idGiocatore: number) {
  try {
    await prisma.giocatori.delete({
      where: {
        idGiocatore: idGiocatore,
      },
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

export async function mapCalendario(
  result: z.infer<typeof calendarioPartiteSchema>[],
): Promise<z.infer<typeof giornataSchema>[]> {
  return result.map((c) => ({
    idCalendario: c.idCalendario,
    idTorneo: c.Tornei.idTorneo,
    giornata: c.giornata,
    giornataSerieA: c.giornataSerieA,
    isGiocata: c.hasGiocata,
    isSovrapposta: c.hasSovrapposta,
    isRecupero: c.hasDaRecuperare,
    data: c.data?.toISOString(),
    dataFine: c.dataFine?.toISOString(),
    girone: c.girone,
    partite: mapPartite(c.Partite),
    Torneo: c.Tornei.nome,
    Descrizione: getDescrizioneTorneo(
      c.Tornei.nome,
      c.giornata,
      c.giornataSerieA,
      c.Tornei.gruppoFase,
    ),
    Title: getTorneoTitle(c.Tornei.nome, c.giornata, c.Tornei.gruppoFase),
    SubTitle: getTorneoSubTitle(c.giornataSerieA),
  }))
}

export async function mapCalendarioWithSerieA(
  result: z.infer<typeof calendarioPartiteSchema>[],
  serieAData: z.infer<typeof serieASchema>[],
): Promise<z.infer<typeof giornataSchema>[]> {
  return result.map((c) => ({
    idCalendario: c.idCalendario,
    idTorneo: c.Tornei.idTorneo,
    giornata: c.giornata,
    giornataSerieA: c.giornataSerieA,
    isGiocata: c.hasGiocata,
    isSovrapposta: c.hasSovrapposta,
    isRecupero: c.hasDaRecuperare,
    data: c.data?.toISOString(),
    dataFine: c.dataFine?.toISOString(),
    girone: c.girone,
    partite: mapPartite(c.Partite),
    Torneo: c.Tornei.nome,
    Descrizione: getDescrizioneTorneo(
      c.Tornei.nome,
      c.giornata,
      c.giornataSerieA,
      c.Tornei.gruppoFase,
    ),
    Title: getTorneoTitle(c.Tornei.nome, c.giornata, c.Tornei.gruppoFase),
    SubTitle: getTorneoSubTitle(c.giornataSerieA),
    SerieA: serieAData.map((s) => ({
      giornata: s.giornata,
      squadraHome: s.squadraHome,
      squadraAway: s.squadraAway,
    })),
  }))
}

export function mapPartite(partite: z.infer<typeof partitaSchema>[]) {
  return partite.map((p) => ({
    idPartita: p.idPartita,
    idHome: p.idSquadraH,
    squadraHome: p.Utenti_Partite_idSquadraHToUtenti?.nomeSquadra,
    fotoHome: p.Utenti_Partite_idSquadraHToUtenti?.foto,
    magliaHome: p.Utenti_Partite_idSquadraHToUtenti?.maglia,
    multaHome: p.hasMultaH,
    golHome: p.golH,
    idAway: p.idSquadraA,
    squadraAway: p.Utenti_Partite_idSquadraAToUtenti?.nomeSquadra,
    fotoAway: p.Utenti_Partite_idSquadraAToUtenti?.foto,
    magliaAway: p.Utenti_Partite_idSquadraAToUtenti?.maglia,
    multaAway: p.hasMultaA,
    golAway: p.golA,
    isFattoreHome: p.fattoreCasalingo,
  }))
}

export async function getCalendarioByTorneo(idtorneo: number) {
  return await getCalendario({ idTorneo: idtorneo })
}

export async function getCalendarioChampions() {
  return await getCalendario({ Tornei: { gruppoFase: { not: null } } })
}

export async function getTornei() {
  return await prisma.tornei.findMany({
    select: {
      idTorneo: true,
      nome: true,
      gruppoFase: true,
      hasClassifica: true,
    },
  })
}

export async function getGiocatoreById(idGiocatore: number) {
  const giocatore = await prisma.giocatori.findUnique({
    where: {
      idGiocatore: idGiocatore,
    },
  })

  if (giocatore) {
    return {
      idGiocatore: giocatore.idGiocatore,
      nome: giocatore.nome,
      nomeFantagazzetta: giocatore.nomeFantaGazzetta,
      ruolo: giocatore.ruolo,
      ruoloEsteso: getRuoloEsteso(giocatore.ruolo),
    }
  }
}

export function getDescrizioneTorneo(
  nome: string,
  giornata: number,
  giornataSerieA: number,
  gruppoFase?: string | null,
): string {
  if (gruppoFase === null || gruppoFase === undefined) {
    return `${nome} ${giornata}ª giornata (${giornataSerieA}ª giornata serie A)`
  } else if (gruppoFase === 'A' || gruppoFase === 'B') {
    return `Gruppo ${gruppoFase} - ${nome} ${giornata}ª giornata (${giornataSerieA}ª giornata serie A)`
  } else {
    return `${gruppoFase} - ${nome} ${giornata}ª giornata (${giornataSerieA}ª giornata serie A)`
  }
}

export function getTorneoTitle(
  nome: string,
  giornata: number,
  gruppoFase?: string | null,
): string {
  if (gruppoFase === null || gruppoFase === undefined) {
    return `${nome} ${giornata}ª giornata`
  } else if (gruppoFase === 'A' || gruppoFase === 'B') {
    return `Gruppo ${gruppoFase} - ${nome} ${giornata}ª giornata`
  } else {
    return `${gruppoFase} - ${nome} ${giornata}ª giornata`
  }
}

export function getTorneoSubTitle(giornataSerieA: number): string {
  return `${giornataSerieA}ª giornata serie A`
}

export function getTorneo(nome: string, gruppoFase?: string | null): string {
  return gruppoFase ? `${nome.trim()} ${gruppoFase.trim()}` : nome.trim()
}

export function getBonusModulo(modulo: string) {
  const moduloToBonusMap: Record<string, number> = {
    '3-5-2': Configurazione.bonusModulo352,
    '4-3-3': Configurazione.bonusModulo433,
    '4-5-1': Configurazione.bonusModulo451,
    '4-4-2': Configurazione.bonusModulo442,
    '3-4-3': Configurazione.bonusModulo343,
    '5-3-2': Configurazione.bonusModulo532,
    '5-4-1': Configurazione.bonusModulo541,
    '': 0,
  }

  return Configurazione.bonusModulo ? (moduloToBonusMap[modulo] ?? 0) : 0
}

export function getGiocatoriVotoInfluente(
  giocatoriFormazione: {
    ruolo: string
    idVoto: number
    voto: Decimal | null
    ammonizione: Decimal
    espulsione: Decimal
    gol: Decimal | null
    assist: Decimal | null
    altriBonus: Decimal | null
    autogol: Decimal | null
    titolare: boolean
    idGiocatore: number
    votoBonus: number
    isSostituito: boolean
    isVotoInfluente: boolean
  }[],
) {
  return giocatoriFormazione.filter((c) => c.isVotoInfluente)
}

export function getBonusSenzaVoto(giocatoriInfluenti: number) {
  return (
    (11 - giocatoriInfluenti > Configurazione.maxSostituzioni
      ? Configurazione.maxSostituzioni
      : 11 - giocatoriInfluenti) * Configurazione.bonusSenzaVoto
  )
}

export function getGolSegnati(fantapunti: number): number {
  const soglieGol = {
    soglia1: 66,
    soglia2: 72,
    soglia3: 78,
    soglia4: 82,
    soglia5: 86,
    soglia6: 90,
    soglia7: 94,
    soglia8: 98,
  }

  let gol = 0

  if (fantapunti >= soglieGol.soglia1 && fantapunti < soglieGol.soglia2) {
    gol = 1
  } else if (
    fantapunti >= soglieGol.soglia2 &&
    fantapunti < soglieGol.soglia3
  ) {
    gol = 2
  } else if (
    fantapunti >= soglieGol.soglia3 &&
    fantapunti < soglieGol.soglia4
  ) {
    gol = 3
  } else if (
    fantapunti >= soglieGol.soglia4 &&
    fantapunti < soglieGol.soglia5
  ) {
    gol = 4
  } else if (
    fantapunti >= soglieGol.soglia5 &&
    fantapunti < soglieGol.soglia6
  ) {
    gol = 5
  } else if (
    fantapunti >= soglieGol.soglia6 &&
    fantapunti < soglieGol.soglia7
  ) {
    gol = 6
  } else if (
    fantapunti >= soglieGol.soglia7 &&
    fantapunti < soglieGol.soglia8
  ) {
    gol = 7
  } else if (fantapunti >= soglieGol.soglia8) {
    gol = 8
  }

  return gol
}

export async function getTabellino(idFormazione: number) {
  const giocatoriFormazione = (
    await prisma.voti.findMany({
      include: {
        Giocatori: {
          select: {
            ruolo: true,
          },
        },
      },
      where: {
        idFormazione: idFormazione,
      },
    })
  ).map((v) => ({
    ruolo: v.Giocatori.ruolo,
    idVoto: v.idVoto,
    voto: v.voto,
    ammonizione: v.ammonizione,
    espulsione: v.espulsione,
    gol: v.gol,
    assist: v.assist,
    altriBonus: v.altriBonus,
    autogol: v.autogol,
    titolare: v.titolare,
    riserva: v.riserva,
    idGiocatore: v.idGiocatore,
    votoBonus: getVotoBonus(v),
    isSostituito: false,
    isVotoInfluente:
      v.titolare && v.voto && v.voto.toNumber() > 0 ? true : false,
  }))

  const countRiserve = getCountRiserve(
    getGiocatoriVotoInfluente(giocatoriFormazione).length,
  )

  if (getGiocatoriVotoInfluente(giocatoriFormazione).length < 11) {
    let iRiserve = 0
    const titolariSenzaVoto = giocatoriFormazione.filter(
      (c) => c.titolare && c.voto && c.voto.toNumber() === 0,
    )
    const riserveConVoto = giocatoriFormazione
      .filter((c) => c.riserva !== null && c.voto && c.voto.toNumber() > 0)
      .sort((a, b) => {
        if (a.riserva === null) return -1
        if (b.riserva === null) return 1
        if (a.riserva !== b.riserva) return a.riserva - b.riserva
        return b.votoBonus - a.votoBonus
      })

    for (const riserva of riserveConVoto) {
      const giocatoreRuolo = titolariSenzaVoto.find(
        (c) => c.ruolo === riserva.ruolo,
      )
      if (giocatoreRuolo) {
        titolariSenzaVoto.splice(
          titolariSenzaVoto.findIndex(
            (r) => r.idVoto === giocatoreRuolo.idVoto,
          ),
          1,
        )
        if (
          riserveConVoto.find(
            (c) => c.ruolo === giocatoreRuolo.ruolo && !c.isVotoInfluente,
          )
        ) {
          // Imposta il titolare che va sostituito
          giocatoriFormazione
            .filter((c) => c.idVoto === giocatoreRuolo.idVoto)
            .forEach((c) => (c.isSostituito = true))
          // Imposta la riserva il cui voto diventa influente
          giocatoriFormazione
            .filter((c) => c.idVoto === riserva.idVoto)
            .forEach((c) => (c.isVotoInfluente = true))
          // Imposta dalla lista riserve il voto influente per non ripescarlo una seconda volta
          riserveConVoto
            .filter((c) => c.idVoto === riserva.idVoto)
            .forEach((c) => (c.isVotoInfluente = true))
          iRiserve++
        }
      }
      if (iRiserve === countRiserve) break
    }
  }
  /* for (const g of giocatoriFormazione.filter(c => c.isVotoInfluente)) {
      Logger.info(`idgiocatore ${g.idGiocatore} ${g.votoBonus}`)
    } */
  return giocatoriFormazione
}

export function getCountRiserve(titolariInfluenti: number) {
  return 11 - titolariInfluenti > Configurazione.maxSostituzioni
    ? Configurazione.maxSostituzioni
    : 11 - titolariInfluenti
}

export function getVotoBonus(voto: {
  voto: Decimal | null
  ammonizione: Decimal
  espulsione: Decimal
  gol: Decimal | null
  assist: Decimal | null
  autogol: Decimal | null
  altriBonus: Decimal | null
}): number {
  let bonus = 0

  // Aggiungi gli altri valori al bonus, gestendo i Decimal e i valori null
  bonus += voto.voto?.toNumber() ?? 0
  bonus += voto.ammonizione?.toNumber() ?? 0
  bonus += voto.espulsione?.toNumber() ?? 0
  bonus += voto.gol?.toNumber() ?? 0
  bonus += voto.assist?.toNumber() ?? 0
  bonus += voto.autogol?.toNumber() ?? 0
  bonus += voto.altriBonus?.toNumber() ?? 0

  //Logger.info(`bonus: ${bonus}`);
  return bonus
}

async function getCalendario(filter: CalendarioFilter) {
  return await prisma.calendario.findMany({
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
            select: { nomeSquadra: true, foto: true, maglia: true },
          },
          Utenti_Partite_idSquadraAToUtenti: {
            select: { nomeSquadra: true, foto: true, maglia: true },
          },
        },
      },
    },
    where: filter,
    orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }],
  })
}

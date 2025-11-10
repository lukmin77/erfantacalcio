import Logger from '~/lib/logger.server'
import { z } from 'zod'
import { adminProcedure } from '../trpc'
import { normalizeNomeGiocatore } from '~/utils/helper'
import prisma from '~/utils/db'
import { Configurazione } from '~/config'
import _ from 'lodash'

const VotoGiocatoreSchema = z.object({
  id_pf: z.number().nullable(),
  Nome: z.string(),
  Ammonizione: z.number(),
  Assist: z.number(),
  Autogol: z.number(),
  Espulsione: z.number(),
  GolSegnati: z.number(),
  GolSubiti: z.number(),
  RigoriErrati: z.number(),
  RigoriParati: z.number(),
  Ruolo: z.string(),
  Squadra: z.string(),
  Voto: z.number().nullable(),
})

export const processVotiProcedure = adminProcedure
  .input(
    z.object({
      idCalendario: z.number(),
      voti: z.array(VotoGiocatoreSchema),
    }),
  )
  .mutation(async (opts) => {
    try {
      Logger.info(`Processing ${opts.input.voti.length} voti`)
      const giocatori = await findAndCreateGiocatori(
        opts.input.voti.map((v) => ({
          id_pf: v.id_pf,
          nome: normalizeNomeGiocatore(v.Nome),
          ruolo: v.Ruolo,
        })),
      )

      for (const voto of opts.input.voti) {
        console.log(`Processing voto for player: ${voto.Nome} ${voto.Squadra}`)
        const idGiocatore =
          giocatori.find(
            (g) =>
              g !== null &&
              (g.id_pf === voto.id_pf ||
                g.nome.toLowerCase() === voto.Nome.toLowerCase()),
          )?.idGiocatore ?? 0

        if ((await findLastTrasferimento(idGiocatore)) === null) {
          const squadraSerieA = await findSquadraSerieA(voto.Squadra)
          if (squadraSerieA !== null) {
            Logger.info(
              `processing idgiocatore: ${idGiocatore}, nome: ${voto.Nome}, squadra: ${squadraSerieA.idSquadraSerieA} ${squadraSerieA.nome}`,
            )
            await createTrasferimento(
              idGiocatore,
              squadraSerieA.idSquadraSerieA,
              squadraSerieA.nome,
            )
          }
        }

        // Calcola i valori del voto in un oggetto separato
        const votoData = {
          voto: voto.Voto,
          ammonizione:
            voto.Ammonizione === 1 ? Configurazione.bonusAmmonizione : 0,
          espulsione:
            voto.Espulsione === 1 ? Configurazione.bonusEspulsione : 0,
          gol:
            voto.Ruolo === 'P'
              ? voto.GolSubiti * Configurazione.bonusGolSubito
              : voto.GolSegnati * Configurazione.bonusGol,
          assist: voto.Assist * Configurazione.bonusAssist,
          autogol: voto.Autogol * Configurazione.bonusAutogol,
          altriBonus:
            (voto.RigoriParati ?? 0) * Configurazione.bonusRigoreParato +
            (voto.RigoriErrati ?? 0) * Configurazione.bonusRigoreSbagliato,
        }

        // Upsert con update e create uguali
        await prisma.voti.upsert({
          where: {
            UQ_Voti_Calendario_Giocatore: {
              idCalendario: opts.input.idCalendario,
              idGiocatore: idGiocatore,
            },
          },
          update: votoData,
          create: {
            idCalendario: opts.input.idCalendario,
            idGiocatore: idGiocatore,
            ...votoData,
          },
        })
      }

      Logger.info(`Process voti successfull completed`)
    } catch (error) {
      Logger.error('Si è verificato un errore', error)
      throw error
    }
  })

async function findAndCreateGiocatori(
  players: { id_pf: number | null; nome: string; ruolo: string }[],
) {
  try {
    // 1️⃣ Trova giocatori esistenti per id_pf
    const giocatoriWithId = await prisma.giocatori.findMany({
      select: {
        idGiocatore: true,
        id_pf: true,
        nome: true,
      },
      where: {
        id_pf: {
          in: players
            .map((p) => p.id_pf)
            .filter((id): id is number => id !== null),
        },
      },
    })

    // 2️⃣ Trova giocatori esistenti per nome
    const giocatoriWithNome = await prisma.giocatori.findMany({
      select: {
        idGiocatore: true,
        id_pf: true,
        nome: true,
      },
      where: {
        nome: { in: players.map((p) => p.nome) },
      },
    })

    // 3️⃣ Unisci per nome o id_pf
    const giocatori = _.uniqBy(
      [...giocatoriWithId, ...giocatoriWithNome],
      (g) => `${g.id_pf ?? ''}_${g.nome}`,
    )

    Logger.info(
      'Giocatori trovati in DB:',
      giocatori.map((g) => ({ nome: g.nome, id_pf: g.id_pf })),
    )

    // 4️⃣ Aggiorna eventuali id_pf mancanti
    await Promise.all(
      giocatori.map(async (g) => {
        if (g && g.id_pf) {
          await prisma.giocatori.update({
            where: { idGiocatore: g.idGiocatore },
            data: { id_pf: g.id_pf },
          })
        }
      }),
    )

    // 5️⃣ Filtra solo i giocatori non ancora in DB
    const newPlayers = players.filter((p) => {
      const match = giocatori.some(
        (g) => (g.id_pf && g.id_pf === p.id_pf) || g.nome === p.nome,
      )
      return !match
    })

    Logger.info('Nuovi giocatori da creare:', newPlayers)

    // 6️⃣ Crea i nuovi giocatori
    if (newPlayers.length > 0) {
      await Promise.all(
        newPlayers.map(async (p) => {
          const created = await createGiocatori([
            { nome: p.nome, ruolo: p.ruolo, id_pf: p.id_pf },
          ])
          giocatori.concat(created)
        }),
      )
    }

    return giocatori
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

async function createGiocatori(
  giocatori: { nome: string; ruolo: string; id_pf: number | null }[],
) {
  try {
    const result = await prisma.giocatori.createMany({
      data: giocatori.map((g) => ({
        id_pf: g.id_pf,
        nome: normalizeNomeGiocatore(g.nome),
        nomeFantaGazzetta: null,
        ruolo: g.ruolo,
      })),
      skipDuplicates: true,
    })
    console.log(`${result.count} giocatori inseriti`)

    const names = giocatori.map((g) => normalizeNomeGiocatore(g.nome))
    const createdGiocatori = await prisma.giocatori.findMany({
      select: {
        idGiocatore: true,
        id_pf: true,
        nome: true,
      },
      where: {
        nome: { in: names },
      },
    })

    return createdGiocatori
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

async function findLastTrasferimento(idGiocatore: number) {
  try {
    const trasferimento = await prisma.trasferimenti.findFirst({
      where: {
        idGiocatore: idGiocatore,
        stagione: Configurazione.stagione,
      },
      orderBy: {
        dataAcquisto: 'desc',
      },
    })
    return trasferimento
  } catch (error) {
    Logger.error('Si è verificato un errore:', idGiocatore, error)
    throw error
  }
}

async function findSquadraSerieA(nome: string) {
  try {
    const squadra = await prisma.squadreSerieA.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: 'insensitive',
        },
      },
    })
    return squadra
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

async function createTrasferimento(
  idGiocatore: number,
  idSquadraSerieA: number,
  nomeSquadraSerieA: string,
) {
  try {
    //Logger.info('Pre-inserimento in Trasferimenti:', { idGiocatore: idGiocatore, idsquadraSerieA: idSquadraSerieA, nomeSquadraSerieA: nomeSquadraSerieA });
    await prisma.trasferimenti.create({
      data: {
        idGiocatore: idGiocatore,
        costo: 0,
        idSquadraSerieA: idSquadraSerieA,
        stagione: Configurazione.stagione,
        nomeSquadraSerieA: nomeSquadraSerieA,
      },
    })
    //Logger.info('Inserito in Trasferimenti:', { trasferimento });
  } catch (error) {
    Logger.error('Si è verificato un errore in createTrasferimento:', {
      idGiocatore: idGiocatore,
      idsquadraSerieA: idSquadraSerieA,
      nomeSquadraSerieA: nomeSquadraSerieA,
      error: error,
    })
    throw error
  }
}

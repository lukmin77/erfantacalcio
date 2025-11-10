import Logger from '~/lib/logger.server'
import { z } from 'zod'
import fs from 'fs'
import { parse } from 'csv-parse'
import { Configurazione } from '~/config'
import { getRuoloEsteso, normalizeNomeGiocatore } from '~/utils/helper'
import { formatToDecimalValue } from '~/utils/numberUtils'
import { type VotiDistinctItem, type iVotoGiocatore } from '~/types/voti'
import path from 'path'
import { uploadFile } from '~/utils/blobVercelUtils'
import prisma from '~/utils/db'
import fetch from 'node-fetch'

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from '~/server/api/trpc'
import { parseInt } from 'lodash'
import _ from 'lodash'

const iVotoGiocatoreSchema = z.object({
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

export const votiRouter = createTRPCRouter({
  get: adminProcedure
    .input(
      z.object({
        idVoto: z.number(),
      }),
    )
    .query(async (opts) => {
      try {
        const result = await prisma.voti.findUnique({
          where: {
            idVoto: opts.input.idVoto,
          },
          select: {
            idVoto: true,
            voto: true,
            ammonizione: true,
            espulsione: true,
            gol: true,
            assist: true,
            autogol: true,
            altriBonus: true,
            titolare: true,
            riserva: true,
            Giocatori: {
              select: { nome: true, ruolo: true },
            },
            Calendario: {
              select: {
                giornataSerieA: true,
                Tornei: { select: { nome: true, gruppoFase: true } },
              },
            },
          },
        })

        if (result !== null) {
          return {
            idVoto: result.idVoto,
            nome: result.Giocatori.nome,
            ruolo: result.Giocatori.ruolo,
            voto: result.voto?.toNumber() ?? null,
            ammonizione: result.ammonizione?.toNumber() ?? null,
            espulsione: result.espulsione?.toNumber() ?? null,
            gol:
              result.Giocatori.ruolo === 'P'
                ? (result.gol?.toNumber() ?? 0) / Configurazione.bonusGolSubito
                : (result.gol?.toNumber() ?? 0) / Configurazione.bonusGol,
            assist:
              (result.assist?.toNumber() ?? 0) / Configurazione.bonusAssist,
            autogol:
              (result.autogol?.toNumber() ?? 0) / Configurazione.bonusAutogol,
            altriBonus: result.altriBonus?.toNumber() ?? null,
            torneo: result.Calendario.Tornei.nome,
            gruppoFase: result.Calendario.Tornei.gruppoFase,
          }
        } else return null
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  list: publicProcedure
    .input(
      z.object({
        idGiocatore: z.number(),
        top: z.number().nullable().optional(),
      }),
    )
    .query(async (opts) => {
      try {
        const result = await prisma.voti.findMany({
          where: {
            idGiocatore: opts.input.idGiocatore,
          },
          select: {
            idVoto: true,
            voto: true,
            ammonizione: true,
            espulsione: true,
            gol: true,
            assist: true,
            autogol: true,
            altriBonus: true,
            titolare: true,
            riserva: true,
            Giocatori: {
              select: { nome: true, ruolo: true },
            },
            Calendario: {
              select: {
                giornataSerieA: true,
                Tornei: { select: { nome: true, gruppoFase: true } },
              },
            },
          },
          orderBy: {
            Calendario: {
              giornataSerieA: 'desc',
            },
          },
          take: opts.input.top ? opts.input.top : 1000,
        })

        if (result !== null) {
          return result.map((c) => ({
            id: c.idVoto,
            nome: c.Giocatori.nome,
            ruolo: c.Giocatori.ruolo,
            voto: c.voto?.toNumber() ?? null,
            ammonizione: c.ammonizione.toNumber() ?? null,
            espulsione: c.espulsione.toNumber() ?? null,
            gol:
              c.Giocatori.ruolo === 'P'
                ? (c.gol?.toNumber() ?? 0) / Configurazione.bonusGolSubito
                : (c.gol?.toNumber() ?? 0) / Configurazione.bonusGol,
            assist: (c.assist?.toNumber() ?? 0) / Configurazione.bonusAssist,
            autogol: (c.autogol?.toNumber() ?? 0) / Configurazione.bonusAutogol,
            altriBonus: c.altriBonus?.toNumber() ?? null,
            torneo: c.Calendario.Tornei.nome,
            gruppoFase: c.Calendario.Tornei.gruppoFase,
            giornataSerieA: c.Calendario.giornataSerieA,
          }))
        } else return null
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  getStatisticaVoti: publicProcedure
    .input(
      z.object({
        idGiocatore: z.number(),
        top: z.number().nullable().optional(),
      }),
    )
    .query(async (opts) => {
      try {
        const result = await prisma.voti.findMany({
          where: {
            idGiocatore: opts.input.idGiocatore,
            voto: { gt: 0 },
          },
          select: {
            idVoto: true,
            voto: true,
            ammonizione: true,
            espulsione: true,
            gol: true,
            assist: true,
            autogol: true,
            altriBonus: true,
            titolare: true,
            riserva: true,
            Giocatori: {
              select: { nome: true, ruolo: true },
            },
            Calendario: {
              select: {
                giornataSerieA: true,
                Tornei: { select: { nome: true, gruppoFase: true } },
              },
            },
          },
          orderBy: {
            Calendario: {
              giornataSerieA: 'asc',
            },
          },
          take: opts.input.top ? opts.input.top : 1000,
        })

        if (result !== null) {
          const voti = result.reduce((acc, c) => {
            const giornata = c.Calendario.giornataSerieA
            if (!acc.has(giornata)) {
              acc.set(giornata, {
                voto: c.voto?.toNumber() ?? null,
                ammonizione: c.ammonizione.toNumber() ?? null,
                espulsione: c.espulsione.toNumber() ?? null,
                gol:
                  c.Giocatori.ruolo === 'P'
                    ? (c.gol?.toNumber() ?? 0) / Configurazione.bonusGolSubito
                    : (c.gol?.toNumber() ?? 0) / Configurazione.bonusGol,
                assist:
                  (c.assist?.toNumber() ?? 0) / Configurazione.bonusAssist,
                giornataSerieA: giornata,
              })
            }
            return acc
          }, new Map())

          const votiDistinct: VotiDistinctItem[] = Array.from(
            voti.values(),
          ) as VotiDistinctItem[]

          return votiDistinct
        } else return []
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        idVoto: z.number(),
        ruolo: z.string(),
        voto: z.number(),
        ammonizione: z.number(),
        espulsione: z.number(),
        gol: z.number(),
        assist: z.number(),
        autogol: z.number(),
        altriBonus: z.number(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const voto = await prisma.voti.update({
          where: {
            idVoto: opts.input.idVoto,
          },
          data: {
            voto: opts.input.voto,
            ammonizione: opts.input.ammonizione,
            espulsione: opts.input.espulsione,
            gol:
              opts.input.ruolo === 'P'
                ? opts.input.gol * Configurazione.bonusGolSubito
                : opts.input.gol * Configurazione.bonusGol,
            assist: opts.input.assist * Configurazione.bonusAssist,
            autogol: opts.input.autogol * Configurazione.bonusAutogol,
            altriBonus: opts.input.altriBonus,
          },
        })
        return voto.idVoto
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  upload: adminProcedure
    .input(
      z.object({
        idCalendario: z.number(),
        fileName: z.string(),
        fileSize: z.number(),
        blockDataBase64: z.string(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const { fileName, fileSize, blockDataBase64 } = opts.input
        const filePath = getPathVoti(fileName)

        fs.writeFileSync(filePath, Buffer.from(blockDataBase64, 'base64'), {
          flag: 'w',
        })

        if (fs.statSync(filePath).size >= fileSize) {
          Logger.info(`Il file ${fileName} è stato completamente salvato.`)
        }
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  uploadVercel: adminProcedure
    .input(
      z.object({
        idCalendario: z.number(),
        fileName: z.string(),
        fileData: z.string(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const { fileName, fileData } = opts.input
        const blob = await uploadFile(fileData, fileName, 'voti')
        Logger.info('file blob: ', blob)
        Logger.info(`Il file ${blob.url} è stato completamente salvato.`)
        return blob.url
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  resetVoti: adminProcedure
    .input(
      z.object({
        idCalendario: z.number(),
      }),
    )
    .mutation(async (opts) => {
      try {
        await resetVoti(opts.input.idCalendario)
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  readVoti: adminProcedure
    .input(
      z.object({
        fileUrl: z.string(),
      }),
    )
    .mutation(async (opts) => {
      try {
        return await readFileVotiVercel(opts.input.fileUrl)
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  processVoti: adminProcedure
    .input(
      z.object({
        idCalendario: z.number(),
        voti: z.array(iVotoGiocatoreSchema),
      }),
    )
    .mutation(async (opts) => {
      try {
        Logger.info(`Processing ${opts.input.voti.length} voti`)
        const giocatori = await findAndCreateGiocatori(opts.input.voti.map(v => ({ id_pf: v.id_pf, nome: v.Nome, ruolo: v.Ruolo })))
        
        for (const voto of opts.input.voti) {
          console.log(`Processing voto for player: ${voto.Nome} ${voto.Squadra}`)
          const idGiocatore = giocatori.find(g => g !== null && (g.id_pf === voto.id_pf || g.nome.toLowerCase() === voto.Nome.toLowerCase()))?.idGiocatore ?? 0
          
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

          const idVoto = await findIdVoto(opts.input.idCalendario, idGiocatore)
          if (idVoto) {
            await updateVoto(idVoto, voto)
          } else {
            await createVoto(opts.input.idCalendario, idGiocatore, voto)
          }
        }

        Logger.info(`Process voti successfull completed`)
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),

  refreshStats: adminProcedure
    .input(
      z.object({
        ruolo: z.string(),
      }),
    )
    .mutation(async (opts) => {
      await refreshStats(opts.input.ruolo)
    }),

  save: adminProcedure
    .input(
      z.object({
        idCalendario: z.number(),
        fileName: z.string(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const filePath = opts.input.fileName
        const idCalendario = opts.input.idCalendario
        if (process.env.NODE_ENV === 'production') {
          Logger.info('PRODUCTION:', opts.input.fileName)
          await saveToVercel(idCalendario, filePath)
        } else {
          Logger.info('other env')
          await saveLocal(idCalendario, filePath)
        }
      } catch (error) {
        Logger.error('Si è verificato un errore', error)
        throw error
      }
    }),
})

async function refreshStats(ruolo: string) {
  try {
    Logger.info(
      `Function sp_RefreshStats${ruolo} for stagione ${Configurazione.stagione} executing`,
    )
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        PERFORM public.sp_RefreshStats_${ruolo}('${ruolo}', '${Configurazione.stagione}');
      END $$;
    `)
    Logger.info(
      `Function sp_RefreshStats${ruolo} for stagione ${Configurazione.stagione} executed successfully`,
    )
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
  }
}

async function resetVoti(idCalendario: number) {
  try {
    await prisma.voti.updateMany({
      where: {
        idCalendario: idCalendario,
      },
      data: {
        voto: 0,
        ammonizione: 0,
        espulsione: 0,
        gol: 0,
        assist: 0,
        autogol: 0,
        altriBonus: 0,
      },
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

async function readFileVoti(filePath: string): Promise<iVotoGiocatore[]> {
  return new Promise((resolve, reject) => {
    const voti: iVotoGiocatore[] = []
    const headers: string[] = []
    for (let i = 1; i <= Configurazione.pfColumns; i++) {
      headers.push(`Col${i}`)
    }
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })

    parse(
      fileContent,
      {
        delimiter: '\t',
        columns: headers,
        on_record: (line: Record<string, string>) => {
          if (
            isNaN(
              parseFloat(
                line[`Col${Configurazione.pfColumnIdGiocatore}`] ?? '0',
              ),
            )
          ) {
            return
          } else {
            voti.push({
              id_pf: line[`Col${Configurazione.pfColumnIdGiocatore}`] ? parseInt(line[`Col${Configurazione.pfColumnIdGiocatore}`] ?? '0') : null,
              Nome: normalizeNomeGiocatore(
                line[`Col${Configurazione.pfColumnNome}`] ?? '',
              ),
              Ruolo: normalizeNomeGiocatore(
                line[`Col${Configurazione.pfColumnRuolo}`] ?? '',
              ),
              Squadra: line[`Col${Configurazione.pfColumnSquadra}`] ?? '',
              Voto: formatToDecimalValue(
                line[`Col${Configurazione.pfColumnVoto}`] ?? '0',
              ),
              GolSegnati: formatToDecimalValue(
                line[`Col${Configurazione.pfColumnGolFatti}`] ?? '0',
              ),
              GolSubiti: formatToDecimalValue(
                line[`Col${Configurazione.pfColumnGolSubiti}`] ?? '0',
              ),
              Assist: formatToDecimalValue(
                line[`Col${Configurazione.pfColumnAssist}`] ?? '0',
              ),
              Ammonizione: formatToDecimalValue(
                line[`Col${Configurazione.pfColumnAmmo}`] ?? '0',
              ),
              Espulsione: formatToDecimalValue(
                line[`Col${Configurazione.pfColumnEspu}`] ?? '0',
              ),
              Autogol: formatToDecimalValue(
                line[`Col${Configurazione.pfColumnAutogol}`] ?? '0',
              ),
              RigoriErrati: formatToDecimalValue(
                line[`Col${Configurazione.pfColumnRigErrato}`] ?? '0',
              ),
              RigoriParati: formatToDecimalValue(
                line[`Col${Configurazione.pfColumnRigParato}`] ?? '0',
              ),
            })
            //Logger.info('voti:', { voti: voti });
          }
        },
      },
      (error) => {
        if (error) {
          console.error(error)
          reject(error)
        }
        console.log(voti.length)
        resolve(voti)
      },
    )
  })
}

async function readFileVotiVercel(fileUrl: string): Promise<iVotoGiocatore[]> {
  const voti: iVotoGiocatore[] = []
  const headers: string[] = []
  for (let i = 1; i <= Configurazione.pfColumns; i++) {
    headers.push(`Col${i}`)
  }

  try {
    Logger.info('fileUrl:', { fileUrl: fileUrl })
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }
    const fileContent = await response.text()

    return new Promise((resolve, reject) => {
      parse(
        fileContent,
        {
          delimiter: '\t',
          columns: headers,
          on_record: (line: Record<string, string>) => {
            if (
              isNaN(
                parseFloat(
                  line[`Col${Configurazione.pfColumnIdGiocatore}`] ?? '0',
                ),
              )
            ) {
              return
            } else {
              voti.push({
                id_pf: line[`Col${Configurazione.pfColumnIdGiocatore}`] ? parseInt(line[`Col${Configurazione.pfColumnIdGiocatore}`] ?? '0') : null,
                Nome: normalizeNomeGiocatore(
                  line[`Col${Configurazione.pfColumnNome}`] ?? '',
                ),
                Ruolo: normalizeNomeGiocatore(
                  line[`Col${Configurazione.pfColumnRuolo}`] ?? '',
                ),
                Squadra: line[`Col${Configurazione.pfColumnSquadra}`] ?? '',
                Voto: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnVoto}`] ?? '0',
                ),
                GolSegnati: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnGolFatti}`] ?? '0',
                ),
                GolSubiti: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnGolSubiti}`] ?? '0',
                ),
                Assist: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnAssist}`] ?? '0',
                ),
                Ammonizione: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnAmmo}`] ?? '0',
                ),
                Espulsione: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnEspu}`] ?? '0',
                ),
                Autogol: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnAutogol}`] ?? '0',
                ),
                RigoriErrati: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnRigErrato}`] ?? '0',
                ),
                RigoriParati: formatToDecimalValue(
                  line[`Col${Configurazione.pfColumnRigParato}`] ?? '0',
                ),
              })
              //Logger.info('voti:', { voti: voti });
            }
          },
        },
        (error) => {
          if (error) {
            console.error(error)
            reject(error)
          } else {
            console.log(voti.length)
            resolve(voti)
          }
        },
      )
    })
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch file data')
  }
}

function getPathVoti(fileName: string) {
  return path.join(process.cwd(), `public/voti/${fileName}`)
}

async function getGiocatoreByNome(nome: string, id_pf: number | null) {
  try {
    const giocatore = await prisma.giocatori.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: 'insensitive',
        },
      },
    })

    if (giocatore) {
      if (id_pf) {
        await prisma.giocatori.update({
          where: {
            idGiocatore: giocatore.idGiocatore,
          },
          data: {
            id_pf: id_pf,
          },
        })
      }
      
      return {
        idGiocatore: giocatore.idGiocatore,
        nome: giocatore.nome,
        nomeFantagazzetta: giocatore.nomeFantaGazzetta,
        ruolo: giocatore.ruolo,
        ruoloEsteso: getRuoloEsteso(giocatore.ruolo),
      }
    } else return null
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

async function findAndCreateGiocatori(players: { id_pf: number | null, nome: string, ruolo: string }[]) {
  try {
    const giocatoriWithId = await prisma.giocatori.findFirst({
      select: {
        idGiocatore: true,
        id_pf: true,
        nome: true,
      },
      where: {
        id_pf:{ in: players.map(p => p.id_pf).filter((id): id is number => id !== null) },
      },
    })
    const giocatoriWithNome = await prisma.giocatori.findFirst({
      select: {
        idGiocatore: true,
        id_pf: true,
        nome: true,
      },
      where: {
        AND: {
          nome: { in: players.map(p => p.nome) },
          NOT: {
            id_pf: giocatoriWithId?.id_pf ?? 0,
          },
        },
      },
    })
    const giocatori = _.unionBy([giocatoriWithId, giocatoriWithNome].filter(Boolean), 'idGiocatore')
    
    await Promise.all(giocatori.map(async (g) => {
      if (g && g.id_pf)
        await prisma.giocatori.update({
          where: {
            idGiocatore: g.idGiocatore,
          },
          data: {
            id_pf: g.id_pf,
          },
        })
      }))

      const newPlayers = players.filter((p) => {
        const matchByIdPf = giocatori.some((g) => g !== null && g.id_pf === p.id_pf)
        const matchByName = giocatori.some((g) => g !== null && g.nome === p.nome)
        return !matchByIdPf && !matchByName
      })

      // Crea nuovi giocatori
      if (newPlayers.length > 0) {
        await Promise.all(
          newPlayers.map(async (p) => {
            const newPlayer = await createGiocatore(p.nome, p.ruolo, p.id_pf)
            giocatori.push(newPlayer)
          }),
        )
      }
    
      return giocatori
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

async function createGiocatore(nome: string, ruolo: string, id_pf: number | null) {
  try {
    const giocatore = await prisma.giocatori.create({
      data: {
        id_pf: id_pf,
        nome: normalizeNomeGiocatore(nome),
        nomeFantaGazzetta: null,
        ruolo: ruolo,
      },
    })
    return giocatore
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

async function findIdVoto(idCalendario: number, idGiocatore: number) {
  try {
    const voto = await prisma.voti.findFirst({
      select: {
        idVoto: true,
      },
      where: {
        idCalendario: idCalendario,
        idGiocatore: idGiocatore,
      },
    })
    return voto?.idVoto
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

async function updateVoto(idVoto: number, v: iVotoGiocatore) {
  try {
    await prisma.voti.update({
      where: {
        idVoto: idVoto,
      },
      data: {
        voto: v.Voto,
        ammonizione: v.Ammonizione === 1 ? Configurazione.bonusAmmonizione : 0,
        espulsione: v.Espulsione === 1 ? Configurazione.bonusEspulsione : 0,
        gol:
          v.Ruolo === 'P'
            ? v.GolSubiti * Configurazione.bonusGolSubito
            : v.GolSegnati * Configurazione.bonusGol,
        assist: v.Assist * Configurazione.bonusAssist,
        autogol: v.Autogol * Configurazione.bonusAutogol,
        altriBonus:
          v.RigoriParati * Configurazione.bonusRigoreParato +
          v.RigoriErrati * Configurazione.bonusRigoreSbagliato,
      },
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

async function createVoto(
  idCalendario: number,
  idGiocatore: number,
  v: iVotoGiocatore,
) {
  try {
    await prisma.voti.create({
      data: {
        idCalendario: idCalendario,
        idGiocatore: idGiocatore,
        voto: v.Voto,
        ammonizione: v.Ammonizione === 1 ? Configurazione.bonusAmmonizione : 0,
        espulsione: v.Espulsione === 1 ? Configurazione.bonusEspulsione : 0,
        gol:
          v.Ruolo === 'P'
            ? v.GolSubiti * Configurazione.bonusGolSubito
            : v.GolSegnati * Configurazione.bonusGol,
        assist: v.Assist * Configurazione.bonusAssist,
        autogol: v.Autogol * Configurazione.bonusAutogol,
        altriBonus:
          v.RigoriParati * Configurazione.bonusRigoreParato +
          v.RigoriErrati * Configurazione.bonusRigoreSbagliato,
      },
    })
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
}

async function saveLocal(idCalendario: number, fileName: string) {
  const fileExists = fs.existsSync(fileName)

  if (!fileExists) {
    Logger.error('Si è verificato un errore, il file non esiste', fileName)
    throw new Error(`Si è verificato un errore, il file ${fileName} non esiste`)
  } else {
    await resetVoti(idCalendario)

    Logger.info('filename:', fileName)
    const voti = await readFileVoti(fileName)
    Logger.info('voti:', voti)

    const giocatori = await findAndCreateGiocatori(voti.map(v => ({ id_pf: v.id_pf, nome: v.Nome, ruolo: v.Ruolo })))

    await Promise.all(
      voti.map(async (voto) => {
        const idGiocatore = giocatori.find(g => g !== null && (g.id_pf === voto.id_pf || g.nome.toLowerCase() === voto.Nome.toLowerCase()))?.idGiocatore ?? 0
        
        if ((await findLastTrasferimento(idGiocatore)) === null) {
          const squadraSerieA = await findSquadraSerieA(voto.Squadra)
          if (squadraSerieA !== null)
            await createTrasferimento(
              idGiocatore,
              squadraSerieA.idSquadraSerieA,
              squadraSerieA.nome,
            )
        }

        const idVoto = await findIdVoto(idCalendario, idGiocatore)
        if (idVoto) await updateVoto(idVoto, voto)
        else await createVoto(idCalendario, idGiocatore, voto)
      }),
    )

    await prisma.voti.deleteMany({
      where: {
        titolare: false,
        riserva: null,
        idCalendario: idCalendario,
      },
    })

    await refreshStats('P')
    await refreshStats('D')
    await refreshStats('C')
    await refreshStats('A')
  }
}

async function saveToVercel(idCalendario: number, fileName: string) {
  Logger.info('filename:', fileName)
  await resetVoti(idCalendario)
  // const voti = await readFileVotiVercel(fileName);
  // await Promise.all(voti.map(async (v) => {
  //   let idGiocatore = (await getGiocatoreByNome(v.Nome))?.idGiocatore;
  //   if (!idGiocatore) {
  //     idGiocatore = await createGiocatore(v.Nome, v.Ruolo);
  //   }
  //   if (await findLastTrasferimento(idGiocatore) === null) {
  //     const squadraSerieA = await findSquadraSerieA(v.Squadra);
  //     if (squadraSerieA !== null)
  //       await createTrasferimento(idGiocatore, squadraSerieA.idSquadraSerieA, squadraSerieA.nome);
  //   }

  //   const idVoto = await findIdVoto(idCalendario, idGiocatore)
  //   if (idVoto)
  //     await updateVoto(idVoto, v);
  //   else
  //     await createVoto(idCalendario, idGiocatore, v);
  // }));

  // await prisma.voti.deleteMany({
  //   where: {
  //     titolare: false,
  //     riserva: null,
  //     idCalendario: idCalendario
  //   }
  // });

  // await refreshStats('P');
  // await refreshStats('D');
  // await refreshStats('C');
  // await refreshStats('A');
}

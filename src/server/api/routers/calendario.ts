import Logger from "~/lib/logger";
import { z } from 'zod';
import { getCalendarioByTorneo, getProssimaGiornata, getProssimaGiornataSerieA, mapCalendario } from './common';

import prisma from "~/utils/db";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure
} from "~/server/api/trpc";
import { type CalendarioType } from '~/types/calendario';
import { toLocaleDateTime } from "~/utils/dateUtils";

export const calendarioRouter = createTRPCRouter({

  listPartiteBySquadra: publicProcedure
    .input(z.object({
      idSquadra: z.number()
    }))
    .query(async (opts) => {
      const idUtente = +opts.input.idSquadra;
      try {

        const result = await prisma.calendario.findMany({
          select: {
            idCalendario: true, giornata: true, giornataSerieA: true, ordine: true, data: true, dataFine: true, hasSovrapposta: true, girone: true, hasGiocata: true, hasDaRecuperare: true,
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true }
            },
            Partite: {
              select: {
                idPartita: true, idSquadraH: true, idSquadraA: true, hasMultaH: true, hasMultaA: true, golH: true, golA: true, fattoreCasalingo: true,
                Utenti_Partite_idSquadraHToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                },
                Utenti_Partite_idSquadraAToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                }
              },
              where: {
                OR: [{ idSquadraH: idUtente }, { idSquadraA: idUtente }]
              }
            },
          },
          orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }]
        });

        return await mapCalendario(result);
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  list: adminProcedure
    .query(async () => {
      try {
        const result = await prisma.calendario.findMany({
          select: {
            idCalendario: true, giornata: true, giornataSerieA: true, ordine: true, data: true, dataFine: true, hasSovrapposta: true, girone: true, hasGiocata: true, hasDaRecuperare: true,
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true }
            }
          },
          orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }]
        });

        const indexSelected = result.findIndex(item => !item.hasGiocata); // && item.Tornei.idTorneo === 1);
        const mappedResult = result.map<CalendarioType>((c, index) => ({
          idCalendario: c.idCalendario,
          idTorneo: c.Tornei.idTorneo,
          nome: c.Tornei.nome,
          gruppoFase: c.Tornei.gruppoFase,
          giornata: c.giornata,
          giornataSerieA: c.giornataSerieA,
          isGiocata: c.hasGiocata,
          isSovrapposta: c.hasSovrapposta,
          isRecupero: c.hasDaRecuperare,
          data: c.data?.toISOString(),
          dataFine: c.dataFine?.toISOString(),
          girone: c.girone,
          isSelected: index === indexSelected ? true : false,
        }));

        return mappedResult;
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  getOne: adminProcedure
    .input(z.object({
      idCalendario: z.number(),
    }))
    .query(async (opts) => {
      try {
        const result = await prisma.calendario.findUnique({
          select: {
            idCalendario: true, giornata: true, giornataSerieA: true, ordine: true, data: true, dataFine: true, hasSovrapposta: true, girone: true, hasGiocata: true, hasDaRecuperare: true,
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true }
            }
          },
          where: {
            idCalendario: opts.input.idCalendario
          }
        });

        if (result) {
          return {
            idCalendario: result.idCalendario,
            idTorneo: result.Tornei.idTorneo,
            nome: result.Tornei.nome,
            gruppoFase: result.Tornei.gruppoFase,
            giornata: result.giornata,
            giornataSerieA: result.giornataSerieA,
            isGiocata: result.hasGiocata,
            isSovrapposta: result.hasSovrapposta,
            isRecupero: result.hasDaRecuperare,
            data: result.data?.toISOString(),
            dataFine: result.dataFine?.toISOString(),
            girone: result.girone,
            isSelected: false,
          } as CalendarioType
        }
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  update: adminProcedure
    .input(z.object({
      idCalendario: z.number(),
      idTorneo: z.number(),
      giornata: z.number(),
      giornataSerieA: z.number(),
      girone: z.number().optional().nullable(),
      data: z.string().datetime().optional().nullable(),
      dataFine: z.string().datetime().optional().nullable(),
      isRecupero: z.boolean(),
      isSovrapposta: z.boolean(),
    }))
    .mutation(async (opts) => {
      try {
        const calendario = await prisma.calendario.update({
          where: {
            idCalendario: opts.input.idCalendario
          },
          data: {
            idTorneo: opts.input.idTorneo,
            giornata: opts.input.giornata,
            giornataSerieA: opts.input.giornataSerieA,
            girone: opts.input.girone,
            hasDaRecuperare: opts.input.isRecupero,
            hasSovrapposta: opts.input.isSovrapposta,
            data: opts.input.data,
            dataFine: opts.input.dataFine,
          }
        });

        return calendario.idCalendario;
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  getProssimeGiornate: publicProcedure
    .query(async () => {
      try {
        const giornataSerieA = await getProssimaGiornataSerieA(false, 'asc');
        return await getProssimaGiornata(giornataSerieA);
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  getUltimiRisultati: publicProcedure
    .query(async () => {
      try {
        const giornataSerieA = await getProssimaGiornataSerieA(true, 'desc');
        Logger.info('giornataseriea:', giornataSerieA);
        const result = await prisma.calendario.findMany({
          select: {
            idCalendario: true, giornata: true, giornataSerieA: true, ordine: true, data: true, dataFine: true, hasSovrapposta: true, girone: true, hasGiocata: true, hasDaRecuperare: true,
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true }
            },
            Partite: {
              select: {
                idPartita: true, idSquadraH: true, idSquadraA: true, hasMultaH: true, hasMultaA: true, golH: true, golA: true, fattoreCasalingo: true,
                Utenti_Partite_idSquadraHToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                },
                Utenti_Partite_idSquadraAToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                }
              }
            },
          },
          where: {
            giornataSerieA: giornataSerieA,
          },
          orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }]
        });

        return await mapCalendario(result);

      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  listByGirone: publicProcedure
    .input(z.number())
    .query(async (opts) => {
      try {
        const girone = opts.input;
        const result = await prisma.calendario.findMany({
          select: {
            idCalendario: true, giornata: true, giornataSerieA: true, ordine: true, data: true, dataFine: true, hasSovrapposta: true, girone: true, hasGiocata: true, hasDaRecuperare: true,
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true }
            },
            Partite: {
              select: {
                idPartita: true, idSquadraH: true, idSquadraA: true, hasMultaH: true, hasMultaA: true, golH: true, golA: true, fattoreCasalingo: true,
                Utenti_Partite_idSquadraHToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                },
                Utenti_Partite_idSquadraAToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                }
              }
            },
          },
          where: {
            girone: girone,
          },
          orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }]
        });

        return await mapCalendario(result);

      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  listRecuperi: publicProcedure
    .query(async () => {
      try {
        const result = await prisma.calendario.findMany({
          select: {
            idCalendario: true, giornata: true, giornataSerieA: true, ordine: true, data: true, dataFine: true, hasSovrapposta: true, girone: true, hasGiocata: true, hasDaRecuperare: true,
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true }
            },
            Partite: {
              select: {
                idPartita: true, idSquadraH: true, idSquadraA: true, hasMultaH: true, hasMultaA: true, golH: true, golA: true, fattoreCasalingo: true,
                Utenti_Partite_idSquadraHToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                },
                Utenti_Partite_idSquadraAToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                }
              }
            },
          },
          where: {
            hasDaRecuperare: true,
          },
          orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }]
        });

        return await mapCalendario(result);

      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  listByTorneo: publicProcedure
    .input(z.number())
    .query(async (opts) => {
      try {
        const idtorneo = opts.input;
        const result = await getCalendarioByTorneo(idtorneo);

        return await mapCalendario(result);

      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  getByGiornataAndTorneo: publicProcedure
    .input(z.object({
      idTorneo: z.number(),
      giornata: z.number()
    }))
    .query(async ({ input }) => {
      try {
        const result = await prisma.calendario.findMany({
          select: {
            idCalendario: true, giornata: true, giornataSerieA: true, ordine: true, data: true, dataFine: true, hasSovrapposta: true, girone: true, hasGiocata: true, hasDaRecuperare: true,
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true }
            },
            Partite: {
              select: {
                idPartita: true, idSquadraH: true, idSquadraA: true, hasMultaH: true, hasMultaA: true, golH: true, golA: true, fattoreCasalingo: true,
                Utenti_Partite_idSquadraHToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                },
                Utenti_Partite_idSquadraAToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                }
              }
            },
          },
          where: {
            AND: [{ idTorneo: input.idTorneo }, { giornata: input.giornata }]
          },
          orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }]
        });

        return await mapCalendario(result);
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  getByIdCalendario: publicProcedure
    .input(z.object({
      idCalendario: z.number()
    }))
    .query(async ({ input }) => {
      try {
        const result = await prisma.calendario.findUnique({
          select: {
            idCalendario: true, giornata: true, giornataSerieA: true, ordine: true, data: true, dataFine: true, hasSovrapposta: true, girone: true, hasGiocata: true, hasDaRecuperare: true,
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true }
            },
            Partite: {
              select: {
                idPartita: true, idSquadraH: true, idSquadraA: true, hasMultaH: true, hasMultaA: true, golH: true, golA: true, fattoreCasalingo: true,
                Utenti_Partite_idSquadraHToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                },
                Utenti_Partite_idSquadraAToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                }
              }
            },
          },
          where: {
            idCalendario: input.idCalendario
          }
        });

        if (result)
          return mapCalendario([result]);
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  listAttuale: publicProcedure
    .query(async () => {
      try {
        const ordine = await getOrdineAttuale();
        const result = await prisma.calendario.findMany({
          select: {
            idCalendario: true, giornata: true, giornataSerieA: true, ordine: true, data: true, dataFine: true, hasSovrapposta: true, girone: true, hasGiocata: true, hasDaRecuperare: true,
            Tornei: {
              select: { idTorneo: true, nome: true, gruppoFase: true }
            },
            Partite: {
              select: {
                idPartita: true, idSquadraH: true, idSquadraA: true, hasMultaH: true, hasMultaA: true, golH: true, golA: true, fattoreCasalingo: true,
                Utenti_Partite_idSquadraHToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                },
                Utenti_Partite_idSquadraAToUtenti: {
                  select: { nomeSquadra: true, foto: true }
                }
              }
            },
          },
          where: {
            AND: [
              { girone: { 'gt': 0 } },
              { giornata: { 'gt': 0 } },
              { ordine: { 'gt': ordine - 2 } },
              { ordine: { 'lt': ordine + 3 } }
            ]
          },
          orderBy: [{ ordine: 'asc' }, { idTorneo: 'asc' }]
        });

        return await mapCalendario(result);

      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),
});

async function getOrdineAttuale() {
  const query = await prisma.calendario.findFirst({
    select: {
      ordine: true
    },
    where: {
      AND: [
        { data: { 'lt': toLocaleDateTime(new Date()) } },
        { giornata: { 'gt': 0 } },
        { girone: { 'gt': 0 } }
      ]
    },
    orderBy: {
      ordine: 'desc'
    }
  });
  return query?.ordine ?? 38;
}


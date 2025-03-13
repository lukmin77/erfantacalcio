import Logger from "~/lib/logger";
import { number, z } from 'zod';
import { Configurazione } from "~/config"
import { chiudiTrasferimentoGiocatore, deleteGiocatore, deleteVotiGiocatore } from "./common";
import { toLocaleDateTime } from "~/utils/dateUtils";

import prisma from "~/utils/db";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure
} from "~/server/api/trpc";




export const trasferimentiRouter = createTRPCRouter({

  list: publicProcedure
    .input(z.object({
      idGiocatore: number()
    }))
    .query(async (opts) => {
      const idGiocatore = +opts.input.idGiocatore;
      try {
        const query = await prisma.trasferimenti.findMany({
          select: {
            idTrasferimento: true, idGiocatore: false, costo: true, media: true, gol: true, assist: true, giocate: true,
            dataAcquisto: true, dataCessione: true, stagione: true, nomeSquadra: true, nomeSquadraSerieA: true,
            Utenti: {
              select: { nomeSquadra: true }
            },
            Giocatori: {
              select: { nome: true, ruolo: true }
            },
            SquadreSerieA: {
              select: { nome: true, maglia: true}
            }
          },
          where: {
            AND: [
              { idGiocatore: idGiocatore },
              //{ stagione: Configurazione.stagione },
              { hasRitirato: false },
              //{ NOT: { dataCessione: null } }
            ]
          },
          orderBy: [{ stagione: 'desc' }, { dataAcquisto: 'desc' }]
        });

        return query.map(t => ({
          id: t.idTrasferimento,
          idTrasferimento: t.idTrasferimento,
          nome: t.Giocatori.nome,
          ruolo: t.Giocatori.ruolo,
          squadra: t.Utenti?.nomeSquadra === undefined ? t.nomeSquadra : t.Utenti.nomeSquadra,
          maglia:  t.SquadreSerieA?.maglia ? `/images/maglie/${t.SquadreSerieA.maglia}` : `/images/maglie/${t.nomeSquadraSerieA?.toLowerCase()}.gif`,
          squadraSerieA: t.SquadreSerieA?.nome === undefined ? t.nomeSquadraSerieA : t.SquadreSerieA.nome,
          costo: t.costo,
          media: t.media ? parseFloat(t.media.toFixed(2)) : 0,
          gol: t.gol,
          assist: t.assist,
          giocate: t.giocate,
          dataAcquisto: t.dataAcquisto,
          dataCessione: t.dataCessione,
          stagione: t.stagione,
          isEditVisible: t.stagione === Configurazione.stagione
        }));
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  statsStagioni: publicProcedure
    .input(z.object({
      idGiocatore: number()
    }))
    .query(async (opts) => {
      const idGiocatore = +opts.input.idGiocatore;
      try {
        const query = await prisma.trasferimenti.findMany({
          select: {
            idTrasferimento: true, idGiocatore: false, costo: true, media: true, gol: true, assist: true, giocate: true,
            dataAcquisto: true, dataCessione: true, stagione: true, nomeSquadra: true, nomeSquadraSerieA: true,
            Utenti: {
              select: { nomeSquadra: true }
            },
            Giocatori: {
              select: { nome: true, ruolo: true }
            },
            SquadreSerieA: {
              select: { nome: true, }
            }
          },
          where: {
            AND: [
              { idGiocatore: idGiocatore },
              { stagione: {'not': Configurazione.stagione} },
              { hasRitirato: false },
              //{ NOT: { dataCessione: null } }
            ]
          },
          orderBy: [{ stagione: 'desc' }, { dataAcquisto: 'desc' }]
        });

        const aggregatedStats: Record<string, { media: number, gol: number, assist: number, giocate: number }> = {};

        query.forEach(({ stagione, media, gol, assist, giocate }) => {
          if (!aggregatedStats[stagione]) {
            aggregatedStats[stagione] = { media: 0, gol: 0, assist: 0, giocate: 0 };
          }
          const currentStats = aggregatedStats[stagione];
          const gamesPlayed = giocate ?? 0;
          if (currentStats && media){
            currentStats.media += gamesPlayed * media?.toNumber();
            currentStats.gol += gol ?? 0;
            currentStats.assist += assist ?? 0;
            currentStats.giocate += gamesPlayed;
          }
        });

        Object.keys(aggregatedStats).forEach(stagione => {
          const stats = aggregatedStats[stagione];
          if (stats && stats.giocate > 0) {
            stats.media /= stats.giocate;
          }
        });

        return Object.entries(aggregatedStats).map(([stagione, stats]) => ({
          stagione,
          media: parseFloat(stats.media.toFixed(2)),
          gol: stats.gol,
          assist: stats.assist,
          giocate: stats.giocate
        }));
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),
  
  get: publicProcedure
    .input(z.object({
      idTrasferimento: number()
    }))
    .query(async (opts) => {
      const idTrasferimento = +opts.input.idTrasferimento;
      try {
        const result = await prisma.trasferimenti.findUnique({
          select: {
            idTrasferimento: true, idGiocatore: true, costo: true, dataAcquisto: true, dataCessione: true,
            Utenti: {
              select: { idUtente: true }
            },
            SquadreSerieA: {
              select: { idSquadraSerieA: true, }
            }
          },
          where: {
            idTrasferimento: idTrasferimento 
          }
        });

        if (result){
          return {
            idTrasferimento: result.idTrasferimento,
            idGiocatore: result.idGiocatore,
            idSquadra: result.Utenti?.idUtente ?? null,
            idSquadraSerieA: result.SquadreSerieA?.idSquadraSerieA ?? null,
            costo: result.costo,
            dataAcquisto: result.dataAcquisto,
            dataCessione: result.dataCessione
          };
        }
        else{
          Logger.warn(`Trasferimento giocatore ${idTrasferimento} non trovato`);
          return null;
        }
        
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  upsert: adminProcedure
    .input(z.object({
      idTrasferimento: z.number(),
      idGiocatore: z.number(),
      idSquadraSerieA: z.number().optional().nullable(),
      idSquadra: z.number().optional().nullable(),
      costo: z.number(),
      dataAcquisto: z.date().optional(),
      dataCessione: z.date().optional().nullable(),
    }))
    .mutation(async (opts) => {

      try {
        const squadra = await prisma.utenti.findUnique({
          select: { nomeSquadra: true },
          where: {
            idUtente: opts.input.idSquadra ?? -1
          }
        });
        const squadraSerieA = await prisma.squadreSerieA.findUnique({
          select: { nome: true },
          where: {
            idSquadraSerieA: opts.input.idSquadraSerieA ?? -1
          }
        });

        if (opts.input.idTrasferimento === 0){
          await chiudiTrasferimentoGiocatore(opts.input.idGiocatore, false);
        }

        const trasferimento = await prisma.trasferimenti.upsert({
          where: {
            idTrasferimento: opts.input.idTrasferimento
          },
          update: {
            idSquadraSerieA: opts.input.idSquadraSerieA ?? null,
            idSquadra: opts.input.idSquadra ?? null,
            nomeSquadra: squadra?.nomeSquadra,
            nomeSquadraSerieA: squadraSerieA?.nome,
            costo: opts.input.costo,
            dataAcquisto: opts.input.dataAcquisto,
            dataCessione: opts.input.dataCessione,
            stagione: Configurazione.stagione,
            hasRitirato: false
          },
          create: {
            idGiocatore: opts.input.idGiocatore,
            idSquadraSerieA: opts.input.idSquadraSerieA,
            idSquadra: opts.input.idSquadra,
            costo: opts.input.costo,
            dataAcquisto: toLocaleDateTime(new Date()),
            dataCessione: null,
            stagione: Configurazione.stagione,
            hasRitirato: false
          }
        });

        
        return trasferimento.idTrasferimento ?? null;
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  delete: adminProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const idtrasferimento = +opts.input;
      try {
        const trasferimento = await prisma.trasferimenti.delete({
          where: {
            idTrasferimento: idtrasferimento
          }
        });
        const count = await prisma.trasferimenti.count({
          where: { idGiocatore: trasferimento.idGiocatore }
        });
        //se non ci sono altri trasferimenti nella stagione vengono eliminati: voti e giocatore
        if (count === 0) {
          await deleteVotiGiocatore(trasferimento.idGiocatore);
          await deleteGiocatore(trasferimento.idGiocatore);
        }
        return trasferimento.idTrasferimento ?? null;
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),
  
  chiudiTrasferimento: adminProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const idGiocatore = +opts.input;
      return await chiudiTrasferimentoGiocatore(idGiocatore, false);
    }),
  
});




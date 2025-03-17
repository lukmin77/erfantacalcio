import Logger from "~/lib/logger";
import { z } from 'zod';
import prisma from "~/utils/db";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";


export const alboRouter = createTRPCRouter({
  
    list : publicProcedure
    .query(async () => {
      try {
        return (await prisma.alboTrofei_new.findMany({
          orderBy: [
            { stagione: 'desc' },
            { campionato: 'desc'},
            { champions: 'desc'},
            { secondo: 'desc'},
            { terzo: 'desc'},
          ]
        })).map(c => ({
          id: c.id,
          stagione: c.stagione,
          campionato: c.campionato,
          champions: c.champions,
          secondo: c.secondo,
          terzo: c.terzo
        }));
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

    get : publicProcedure
    .input(z.object({ 
      idSquadra: z.number() 
    }))
    .query(async (opts) => {
      try {
        const utente = await prisma.utenti.findUnique({
          where: {
            idUtente: opts.input.idSquadra
          }
        });
        if (utente) {
          return {
            squadra: utente.nomeSquadra,
            campionato: utente.Campionato,
            champions: utente.Champions,
            secondo: utente.Secondo,
            terzo: utente.Terzo
          };
        }
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    })
});
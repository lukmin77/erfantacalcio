import Logger from "~/lib/logger";
import prisma from "~/utils/db";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";


export const squadreSerieARouter = createTRPCRouter({
  list: publicProcedure
    .query(async () => {
      try {
        return await prisma.squadreSerieA.findMany({
            select: {
              idSquadraSerieA: true,
              nome: true,
              maglia: true
            },
          });
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),

  
});
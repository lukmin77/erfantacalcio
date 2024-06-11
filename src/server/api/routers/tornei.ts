import Logger from "~/lib/logger";
import { getTornei } from "./common";


import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";



export const torneiRouter = createTRPCRouter({
  list: publicProcedure
    .query(async () => {
      try {
        return await getTornei();
      } catch (error) {
        Logger.error('Si è verificato un errore', error);
        throw error;
      }
    }),
});




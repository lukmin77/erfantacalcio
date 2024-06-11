import { createTRPCRouter } from "~/server/api/trpc";

import { squadreRouter } from "./routers/squadre"
import { calendarioRouter } from "./routers/calendario"
import { formazioneRouter } from "./routers/formazione"
import { profiloRouter } from "./routers/profilo"
import { alboRouter } from "./routers/albo"
import { squadreSerieARouter } from "./routers/squadreSerieA";
import { torneiRouter } from "./routers/tornei";
import { classificaRouter } from "./routers/classifica";
import { giocatoriRouter } from "./routers/giocatori";
import { votiRouter } from "./routers/voti";
import { nuovastagioneRouter } from "./routers/nuovastagione";
import { trasferimentiRouter } from "./routers/trasferimenti";
import { risultatiRouter } from "./routers/risultati";
import { partitaRouter } from "./routers/partita";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  albo: alboRouter,
  calendario: calendarioRouter,
  classifica: classificaRouter,
  formazione: formazioneRouter,
  partita: partitaRouter,
  giocatori: giocatoriRouter,
  profilo: profiloRouter,
  squadre: squadreRouter,
  squadreSerieA: squadreSerieARouter,  
  tornei: torneiRouter,
  voti: votiRouter,
  nuovaStagione: nuovastagioneRouter,
  trasferimenti: trasferimentiRouter,
  risultati: risultatiRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

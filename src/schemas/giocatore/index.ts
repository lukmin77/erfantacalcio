import { z } from 'zod'

export const giocatoreSchema = z.object({
  idGiocatore: z.number(),
  nome: z.string().min(3),
  nomeFantagazzetta: z.string().nullable().optional(),
  ruolo: z.string(),
})

export const trasferimentoSchema = z.object({
  idTrasferimento: z.number(),
  idGiocatore: z.number(),
  idSquadraSerieA: z.number().optional().nullable(),
  idSquadra: z.number().optional().nullable(),
  costo: z.number(),
  dataAcquisto: z.date().optional(),
  dataCessione: z.date().optional().nullable(),
})

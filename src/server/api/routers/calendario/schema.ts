import { z } from 'zod'

export const calendarioSchema = z.object({
  id: z.number().default(0),
  idTorneo: z.number().default(1),
  nome: z.string().default(''),
  gruppoFase: z.string().nullable().default(null),
  giornata: z.number().default(0),
  giornataSerieA: z.number().default(0),
  isGiocata: z.boolean().default(false),
  isSovrapposta: z.boolean().default(false),
  isRecupero: z.boolean().default(false),
  data: z.string().optional().default(''),
  dataFine: z.string().optional().default(''),
  girone: z.number().nullable().default(null),
  isSelected: z.boolean().default(false),
})

export const calendarioListSchema = z.array(calendarioSchema)

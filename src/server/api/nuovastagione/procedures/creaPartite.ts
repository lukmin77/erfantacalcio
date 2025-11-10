import { adminProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import { Configurazione } from '~/config'
import { checkCountPartite, creaPartite, creaPartiteEmpty, updateFase } from '../services/helpers'
import { getTornei } from '../../../utils/common'
import { messageSchema } from '../schema'
import { z } from 'zod'

export const creaPartiteProcedure = adminProcedure.mutation<z.infer<typeof messageSchema>>(async () => {
  try {
    if ((await checkCountPartite()) === false) {
      Logger.warn('Impossibile procedere con la nuova Stagione, partite già inserite')
      return { isError: true, isComplete: true, message: 'Impossibile procedere con la nuova Stagione, partite già inserite' }
    } else {
      const tornei = await getTornei()

  let idTorneo = tornei.find((c: { nome: string; gruppoFase?: string | null; idTorneo: number }) => c.nome.toLowerCase() === 'campionato')?.idTorneo
      if (!idTorneo) throw new Error("Nessun torneo trovato con il nome 'campionato'.")
      await creaPartite(8, idTorneo, true)

  idTorneo = tornei.find((c: { nome: string; gruppoFase?: string | null; idTorneo: number }) => c.nome.toLowerCase() === 'champions' && c.gruppoFase?.toUpperCase() === 'A')?.idTorneo
      if (!idTorneo) throw new Error("Nessun torneo trovato con il nome 'champions' girone 'A'.")
      await creaPartite(4, idTorneo, false)

  idTorneo = tornei.find((c: { nome: string; gruppoFase?: string | null; idTorneo: number }) => c.nome.toLowerCase() === 'champions' && c.gruppoFase?.toUpperCase() === 'B')?.idTorneo
      if (!idTorneo) throw new Error("Nessun torneo trovato con il nome 'champions' e fase girone 'B'.")
      await creaPartite(4, idTorneo, false, 4)

  idTorneo = tornei.find((c: { nome: string; gruppoFase?: string | null; idTorneo: number }) => c.nome.toLowerCase() === 'champions' && c.gruppoFase?.toLowerCase() === 'semifinali andata')?.idTorneo
      if (!idTorneo) throw new Error("Nessun torneo trovato con il nome 'champions' e fase 'semifinali andata'.")
      await creaPartiteEmpty(2, idTorneo, true)

  idTorneo = tornei.find((c: { nome: string; gruppoFase?: string | null; idTorneo: number }) => c.nome.toLowerCase() === 'champions' && c.gruppoFase?.toLowerCase() === 'semifinali ritorno')?.idTorneo
      if (!idTorneo) throw new Error("Nessun torneo trovato con il nome 'champions' e fase 'semifinali ritorno'.")
      await creaPartiteEmpty(2, idTorneo, true)

  idTorneo = tornei.find((c: { nome: string; gruppoFase?: string | null; idTorneo: number }) => c.nome.toLowerCase() === 'champions' && c.gruppoFase?.toLowerCase() === 'finale')?.idTorneo
      if (!idTorneo) throw new Error("Nessun torneo trovato con il nome 'champions' e fase 'finale'.")
      await creaPartiteEmpty(1, idTorneo, false)

      await updateFase(4)

      Logger.info(`Le partite della stagione ${Configurazione.stagione} sono state create`)
      return { isError: false, isComplete: true, message: `Le partite della stagione ${Configurazione.stagione} sono state create` }
    }
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

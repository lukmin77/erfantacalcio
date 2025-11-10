import { adminProcedure } from '~/server/api/trpc'
import Logger from '~/lib/logger.server'
import { Configurazione } from '~/config'
import { creaClassifica, updateFase, checkCountClassifiche } from '../services/helpers'
import { getTornei } from '../../../utils/common'
import { messageSchema } from '../schema'
import { z } from 'zod'

export const creaClassificheProcedure = adminProcedure.mutation<z.infer<typeof messageSchema>>(async () => {
  try {
    if ((await checkCountClassifiche()) === false) {
      Logger.warn('Impossibile procedere con la nuova Stagione, classifiche già inserite')
      return { isError: true, isComplete: true, message: 'Impossibile procedere con la nuova Stagione, classifiche già inserite' }
    } else {
      const tornei = await getTornei()

  let idTorneo = tornei.find((c: { nome: string; gruppoFase?: string | null; idTorneo: number }) => c.nome.toLowerCase() === 'campionato')?.idTorneo
      if (!idTorneo) throw new Error("Nessun torneo trovato con il nome 'campionato'.")
      await creaClassifica(idTorneo, 1, 8)

  idTorneo = tornei.find((c: { nome: string; gruppoFase?: string | null; idTorneo: number }) => c.nome.toLowerCase() === 'champions' && c.gruppoFase?.toUpperCase() === 'A')?.idTorneo
      if (!idTorneo) throw new Error("Nessun torneo trovato con il nome 'champions' girone 'A'.")
      await creaClassifica(idTorneo, 1, 4)

  idTorneo = tornei.find((c: { nome: string; gruppoFase?: string | null; idTorneo: number }) => c.nome.toLowerCase() === 'champions' && c.gruppoFase?.toUpperCase() === 'B')?.idTorneo
      if (!idTorneo) throw new Error("Nessun torneo trovato con il nome 'champions' e fase girone 'B'.")
      await creaClassifica(idTorneo, 5, 8)

      await updateFase(5)

      Logger.info(`Le classifiche della stagione ${Configurazione.stagione} sono state create`)
      return { isError: false, isComplete: true, message: `Le classifiche della stagione ${Configurazione.stagione} sono state create` }
    }
  } catch (error) {
    Logger.error('Si è verificato un errore', error)
    throw error
  }
})

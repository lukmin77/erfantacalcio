import { publicProcedure } from '~/server/api/trpc'
import { getCalendario, mapCalendario } from '../../../utils/common'

export const listRecuperiProcedure = publicProcedure.query(async () => {
  try {
    const result = await getCalendario({ hasDaRecuperare: true })
    return await mapCalendario(result)
  } catch (error) {
    console.error('Si è verificato un errore', error)
    throw error
  }
})

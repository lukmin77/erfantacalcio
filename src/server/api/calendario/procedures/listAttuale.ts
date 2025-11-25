import { publicProcedure } from '~/server/api/trpc'
import { getCalendario, mapCalendario } from '../../../utils/common'
import { Between, MoreThan } from 'typeorm'

export const listAttualeProcedure = publicProcedure.query(async () => {
  try {
    const currentDateMinus = new Date()
    currentDateMinus.setDate(currentDateMinus.getDate() - 10)
    const currentDatePlus = new Date()
    currentDatePlus.setDate(currentDateMinus.getDate() + 10)
    const result = await getCalendario({
      girone: MoreThan(0),
      giornata: MoreThan(0),
      data: Between(currentDateMinus, currentDatePlus),
    })
    return await mapCalendario(result)
  } catch (error) {
    console.error('Si è verificato un errore', error)
    throw error
  }
})

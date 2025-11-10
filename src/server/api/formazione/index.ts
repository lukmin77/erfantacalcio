import { createTRPCRouter } from '~/server/api/trpc'

import { giornateDaGiocare } from './procedures/giornateDaGiocare'
import { show } from './procedures/show'
import { create } from './procedures/create'

export const formazioneRouter = createTRPCRouter({
  getGiornateDaGiocare: giornateDaGiocare,
  get: show,
  create: create,
})

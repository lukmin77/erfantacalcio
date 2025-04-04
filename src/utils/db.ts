import { PrismaClient } from '@prisma/client'
import Logger from '~/lib/logger'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
prisma.$on('query', (e) => {
  // Logger.debug('Query: ' + e.query)
  // Logger.debug('Params: ' + e.params)
  // Logger.debug('Duration: ' + e.duration + 'ms')
})

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

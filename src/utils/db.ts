import { PrismaClient } from '@prisma/client'
import Logger from '~/lib/logger';

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
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
prisma.$on('query', (e) => {
  Logger.info('Query: ' + e.query)
  Logger.info('Params: ' + e.params)
  Logger.info('Duration: ' + e.duration + 'ms')
});

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
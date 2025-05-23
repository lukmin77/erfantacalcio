// lib/logger.server.ts
import pino from 'pino'

const isDev = process.env.NODE_ENV !== 'production'

const logger = pino({
  level: isDev ? 'debug' : 'info',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
})

export default logger

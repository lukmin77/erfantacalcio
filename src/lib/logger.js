// logger.js
import winston from 'winston'
const { format, transports } = winston
/* import DailyRotateFile from "winston-daily-rotate-file"; */
const { combine, splat, timestamp, printf } = format

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  //http: 4,
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

//const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`);
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `
  if (metadata) msg += JSON.stringify(metadata)

  return msg
})

const Logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format: combine(
    //format.colorize(),
    splat(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    /* new DailyRotateFile({
      filename: 'logs/application-error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '5m',
      maxFiles: '7d',
      level: 'error'
    }),
    new DailyRotateFile({
      filename: 'logs/application-all-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '5m',
      maxFiles: '7d'
    }) */
  ],
})

export default Logger

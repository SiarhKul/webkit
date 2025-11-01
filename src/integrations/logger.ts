import winston from 'winston'
import LokiTransport from 'winston-loki'

const {
  combine,
  timestamp,
  printf,
  colorize,
  json,
  splat,
  prettyPrint,
  simple,
} = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    splat(),
    json(),
    colorize(),
    timestamp(),
    prettyPrint(),
    simple(),
    printf((info) => {
      const levelStr =
        typeof info.level === 'string' ? info.level : String(info.level)
      const tsStr =
        typeof info.timestamp === 'string'
          ? info.timestamp
          : info.timestamp !== undefined
            ? JSON.stringify(info.timestamp)
            : ''
      if (info.stack) {
        const stackStr =
          typeof info.stack === 'string'
            ? info.stack
            : JSON.stringify(info.stack)
        return `${tsStr} ${levelStr}: ${stackStr}`
      }
      const msgStr =
        typeof info.message === 'string'
          ? info.message
          : JSON.stringify(info.message)
      return `${tsStr} ${levelStr}: ${msgStr}`
    })
  ),
  transports: [
    new winston.transports.Console(),
    new LokiTransport({
      host: process.env.LOKI_HOST || 'http://localhost:3100',
    }),
  ],
})

export default logger

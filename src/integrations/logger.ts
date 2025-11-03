import winston from 'winston'
import LokiTransport from 'winston-loki'
import { config } from './config'

const { combine, timestamp, printf, colorize, splat } = winston.format

const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  splat(),
  printf((info) => {
    const timestamp =
      typeof info.timestamp === 'string'
        ? info.timestamp
        : info.timestamp
          ? JSON.stringify(info.timestamp)
          : ''
    const message =
      typeof info.message === 'string'
        ? info.message
        : info.message
          ? JSON.stringify(info.message)
          : ''
    return `${timestamp} ${info.level}: ${message}`
  })
)

const transports: winston.transport[] = [
  new LokiTransport({
    host: config.LOKI_HOST,
    labels: { app: `be-${config.NODE_ENV}-webkit` },
    json: true,
    replaceTimestamp: true,
    onConnectionError: (err) => console.error(err),
  }),

  new winston.transports.Console({
    format: consoleFormat,
  }),
]

const logger = winston.createLogger({
  level: 'info',
  transports,
})

export default logger

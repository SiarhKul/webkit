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
  new winston.transports.Console({
    format: consoleFormat,
  }),
]

if (config.LOG_TO_LOKI && config.LOKI_HOST) {
  transports.push(
    new LokiTransport({
      host: config.LOKI_HOST,
      labels: { app: `be-${config.NODE_ENV}-webkit` },
      json: true,
      replaceTimestamp: true,
      format: winston.format.json(),
      onConnectionError: (err) => console.error(err),
    })
  )
}

const logger = winston.createLogger({
  level: 'info',
  transports,
})

export default logger

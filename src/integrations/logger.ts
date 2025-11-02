import winston from 'winston'
import LokiTransport from 'winston-loki'

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

const logger = winston.createLogger({
  level: 'info',

  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),

    new LokiTransport({
      host: process.env.LOKI_HOST || 'http://localhost:3100',
      labels: { app: `be-${process.env.NODE_ENV || 'local'}-webkit` },

      json: true,
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
    }),
  ],
})

export default logger

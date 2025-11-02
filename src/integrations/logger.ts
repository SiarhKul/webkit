import winston from 'winston'
import LokiTransport from 'winston-loki'

const { combine, timestamp, printf, colorize, splat } = winston.format

const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  splat(),
  printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`
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
      labels: { app: 'be-local-webkit' },
      json: true,
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
    }),
  ],
})

export default logger

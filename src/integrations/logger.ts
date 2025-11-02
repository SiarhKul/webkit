import winston from 'winston'
import LokiTransport from 'winston-loki'

const { combine, timestamp, printf, colorize, json, splat } = winston.format

const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  splat(),
  printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`
  })
)

const lokiFormat = combine(timestamp(), json())

const logger = winston.createLogger({
  level: 'info',

  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),

    new LokiTransport({
      host: process.env.LOKI_HOST || 'http://localhost:3100',
      labels: { app: 'my-app' },
      format: lokiFormat,
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
    }),
  ],
})

logger.info('Это тестовый лог для Loki и консоли')
logger.warn('Это %s лог', 'ПРЕДУПРЕЖДАЮЩИЙ')
logger.error(new Error('Это тестовая ошибка'))

export default logger

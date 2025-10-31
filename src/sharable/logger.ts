import winston from 'winston'

const {
  combine,
  timestamp,
  printf,
  colorize,
  json,
  splat,
  prettyPrint,
  simple,
  errors,
} = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    errors({ stack: true }), // <– Log the full stack
    splat(),
    json(),
    colorize(),
    timestamp(),
    prettyPrint(),
    simple(),
    printf(({ level, message, timestamp, stack }) => {
      if (stack) {
        // print log with stack
        return `${timestamp} ${level}: ${stack}`
      }
      const mes =
        typeof message === 'string' ? message : JSON.stringify(message)
      return `${timestamp} ${level}: ${mes}`
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

export default logger

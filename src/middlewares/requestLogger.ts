import { Request, Response, NextFunction } from 'express'
import logger from '../integrations/logger'

interface LoggedRequest extends Request {
  body: unknown
}

export const requestLogger = (
  req: LoggedRequest,
  res: Response,
  next: NextFunction
) => {
  const { method, url, body } = req
  logger.info('Request received: %o', {
    method,
    url,
    body,
    user: 'Jone Doe',
  })

  next()
}

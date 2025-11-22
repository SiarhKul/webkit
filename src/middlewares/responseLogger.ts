import { Request, Response, NextFunction } from 'express'
import logger from '../integrations/logger'

interface LoggedRequest extends Request {
  requestId?: string
  startTime?: number
}

export const responseMiddleware = (
  req: LoggedRequest,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send
  const requestId = req.requestId || 'unknown'
  const startTime = req.startTime || Date.now()

  res.send = function (body: unknown): Response {
    const responseTime = Date.now() - startTime
    const { statusCode } = res

    // Log response
    logger.info('Outgoing response: %o', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode,
      responseTime: `${responseTime}ms`,
      responseSize:
        typeof body === 'string' ? body.length : JSON.stringify(body).length,
      timestamp: new Date().toISOString(),
    })

    return originalSend.call(this, body) as Response
  }

  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    if (!res.headersSent) {
      logger.info('Response finished: %o', {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      })
    }
  })

  next()
}

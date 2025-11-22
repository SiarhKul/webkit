import { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'crypto'
import logger from '../integrations/logger'

interface LoggedRequest extends Request {
  body: unknown
  requestId?: string
  startTime?: number
}

export const requestMiddleware = (
  req: LoggedRequest,
  res: Response,
  next: NextFunction
) => {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID()
  req.requestId = requestId
  req.startTime = Date.now()

  res.setHeader('X-Request-ID', requestId)
  console.log('------------------')
  const { method, url, body, query, headers, ip } = req

  const userAgent = headers['user-agent'] || 'Unknown'
  const contentType = headers['content-type'] || 'N/A'

  logger.info('Incoming request: %o', {
    requestId,
    method,
    url,
    path: url.split('?')[0],
    query: Object.keys(query).length > 0 ? query : undefined,
    body: body && Object.keys(body).length > 0 ? body : undefined,
    ip: ip || req.socket.remoteAddress,
    userAgent,
    contentType,
    timestamp: new Date().toISOString(),
  })

  next()
}

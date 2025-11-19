import slowDown from 'express-slow-down'
import { Request, Response } from 'express'
import { ErrorResponse } from '../sharable/jsend/ErrorResponse'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'

export const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // 15 minutes
  delayAfter: 2, // allow 100 requests per 15 minutes, then...
  delayMs: (hits) => hits * 300, // begin adding 500ms of delay per request above 100:
  maxDelayMs: 5 * 1000, // Will not increase delay beyond 10 seconds.
  message: (req: Request, res: Response) => {
    return new ErrorResponse({
      message: 'Request frequency is too high.',
      code: ErrorCodes.TOO_FREQUENT_REQUESTS,
      name: 'To frequent requests',
    })
  },
})

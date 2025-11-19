import rateLimit from 'express-rate-limit'
import { ErrorResponse } from '../sharable/jsend/ErrorResponse'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  limit: 2, // Limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: () => {
    return new ErrorResponse({
      message: 'Too many requests, please try again later.',
      code: ErrorCodes.TOO_MANY_REQUESTS,
      name: 'Too Many Requests',
    })
  },
})

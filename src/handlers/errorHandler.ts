import { type Request, type Response, type NextFunction } from 'express'
import { ErrorResponse } from '../sharable/jsend/ErrorResponse'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'
import logger from '../integrations/logger'

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    if (err.code === ErrorCodes.VALIDATION_ERROR) {
      return res.status(err.statusCode).json(
        new ErrorResponse({
          code: err.code,
          name: 'Validation Error',
          message: err.message,
        })
      )
    }

    if (err.code === ErrorCodes.DUPLICATE_DATA) {
      return res.status(err.statusCode).json(
        new ErrorResponse({
          code: err.code,
          name: 'Duplicate Data',
          message: err.message,
        })
      )
    }

    if (err.code === ErrorCodes.ENTITY_NOT_FOUND) {
      return res.status(err.statusCode).json(
        new ErrorResponse({
          code: err.code,
          name: 'Entity not found',
          message: err.message,
        })
      )
    }
  }

  const ucr = new ErrorResponse({
    code: 'UNCAUGHT_ERROR',
    name: 'Uncaught error',
    message: 'The services handled an uncaught error',
  })

  logger.error('Uncaught error %o:', {
    ...ucr,
    data: err,
  })

  return res.status(500).json(ucr)
}

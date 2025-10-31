import { type Request, type Response, type NextFunction } from 'express'
import { ErrorResponse } from '../sharable/jsend/ErrorResponse'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'

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
  }

  return res.status(500).json(
    new ErrorResponse({
      code: 'UNKNOWN_ERROR',
      name: 'Unknown error',
      message: 'The services handled an unknown error',
    })
  )
}

import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'
import { Request, Response, NextFunction } from 'express'

export const allController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(404, ErrorCodes.NOT_FOUND, `Can't find ${req.originalUrl}`))
}

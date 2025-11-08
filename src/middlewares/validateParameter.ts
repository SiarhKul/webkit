import { NextFunction, Request, Response } from 'express'
import { param, validationResult } from 'express-validator'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'

export const validateParameter = (parameter: string) => [
  param(parameter)
    .isInt({ gt: 0 })
    .withMessage('User ID must be a positive integer.'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      next(
        new AppError(
          400,
          ErrorCodes.VALIDATION_ERROR,
          JSON.stringify(errors.array())
        )
      )
    }
    next()
  },
]

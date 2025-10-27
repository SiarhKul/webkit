import type { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'

export class UserController {
  static sighIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email) {
        return next(
          new AppError(422, ErrorCodes.VALIDATION_ERROR, 'Email is required')
        )
      }

      const users = await UserService.sighIn(req.body)
      res.status(200).json({ status: 'success', data: { users } })
    } catch (err) {
      next(err)
    }
  }
}

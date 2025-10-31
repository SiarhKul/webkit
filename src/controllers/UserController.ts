import type { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'
import { User } from '../entity/User'
import { SuccessResponse } from '../sharable/jsend/SuccessResponse'
import { zUserRequest } from '../sharable/schemas/user'
import { z } from 'zod'
export class UserController {
  static sighIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = zUserRequest.safeParse(req.body)

      if (validationResult.error) {
        console.log(validationResult)
        throw new AppError(
          422,
          ErrorCodes.VALIDATION_ERROR,
          z.prettifyError(validationResult.error)
        )
      }

      const users = await UserService.sighIn(validationResult.data)
      res.status(200).json(new SuccessResponse<User>(users))
    } catch (err) {
      next(err)
    }
  }
}

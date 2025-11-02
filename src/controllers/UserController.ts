import type { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'
import { User } from '../entity/User'
import { SuccessResponse } from '../sharable/jsend/SuccessResponse'
import { zUserRequest } from '../sharable/schemas/user'
import { z } from 'zod'
import logger from '../integrations/logger'

export class UserController {
  static sighIn = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('1')

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
      console.log('1111111111111111', users)
      logger.info('User has been created')
      res.status(200).json(new SuccessResponse<User>(users))
    } catch (err) {
      next(err)
    }
  }
}

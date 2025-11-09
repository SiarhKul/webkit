import type { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'
import { User } from '../entity/User'
import { SuccessResponse } from '../sharable/jsend/SuccessResponse'

import logger from '../integrations/logger'
import { validate } from 'class-validator'

export class UserController {
  static sighIn = async (req: Request, res: Response, next: NextFunction) => {
    const userRequest = new User()
    Object.assign(userRequest, req.body)

    try {
      const errors = await validate(userRequest)
      if (errors.length === 0) {
        const user = await UserService.sighIn(userRequest)
        logger.info('User has been created %o', user)
        res.status(200).json(new SuccessResponse<User>(user))
      } else {
        logger.error('User validation fail %o', errors)
        throw new AppError(
          422,
          ErrorCodes.VALIDATION_ERROR,
          JSON.stringify(errors)
        )
      }
    } catch (err) {
      next(err)
    }
  }

  static getAllUsers = async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers()

    res.status(200).json(new SuccessResponse<User[]>(users))
  }

  static deleteUserBy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id)

      await UserService.deleteUserBy(id)
      return res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
}

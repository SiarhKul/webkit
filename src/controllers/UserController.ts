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

    const errors = await validate(userRequest)
    if (errors.length === 0) {
      const user = await UserService.sighIn(userRequest)
      logger.info('User has been created %o', user)
      res.status(200).json(new SuccessResponse<User>(user))
    } else {
      logger.error('User validation fail %o', errors)
      next(
        new AppError(422, ErrorCodes.VALIDATION_ERROR, JSON.stringify(errors))
      )
    }
  }

  static getAllUsers = async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers()

    res.status(200).json(new SuccessResponse<User[]>(users))
  }

  static getUserById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const user = await UserService.getUserById(id)
    logger.info('User retrieved by ID: %d', id)
    res.status(200).json(new SuccessResponse<User>(user))
  }

  static updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = Number(req.params.id)

    const userRequest = new User()
    Object.assign(userRequest, req.body)

    const errors = await validate(userRequest, { skipMissingProperties: true })
    if (errors.length === 0) {
      const user = await UserService.updateUserById(id, userRequest)
      logger.info('User has been updated %o', user)
      res.status(200).json(new SuccessResponse<User>(user))
    } else {
      logger.error('User validation fail %o', errors)
      next(
        new AppError(422, ErrorCodes.VALIDATION_ERROR, JSON.stringify(errors))
      )
    }
  }

  static deleteUserBy = async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    await UserService.deleteUserBy(id)
    logger.info('User deleted by ID: %d', id)
    return res.status(204).send()
  }
}

import type { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'
import { Roles, User } from '../entity/User'
import { z } from 'zod'
import { SuccessResponse } from '../sharable/jsend/SuccessResponse'

const zUserRequest = z.object({
  firstName: z.string().max(255, 'Too long'),
  lastName: z.string().max(255, 'Too long'),
  email: z.email('Must be email'),
  password: z.string().min(8, 'Must be more than 8'),
  role: z.enum(Roles),
})

export type TUserRequest = z.infer<typeof zUserRequest>

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

import type { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'
import { Roles } from '../entity/User'
import { z } from 'zod'

const zUserRequest = z.object({
  firstName: z.string().max(255, 'Too long'),
  lastName: z.string().max(255, 'Too long'),
  email: z.email('Must be email'),
  password: z.string().min(8, 'Must be more than 8'),
  role: z.enum(Roles, 'Must be role'),
})

export type TUserRequest = z.infer<typeof zUserRequest>
//todo check validation
export class UserController {
  static sighIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = zUserRequest.safeParse(req.body)

      if (validationResult.error) {
        throw new AppError(
          422,
          ErrorCodes.VALIDATION_ERROR,
          'User validation failed'
        )
      }

      const user: TUserRequest = validationResult.data

      const users = await UserService.sighIn(user)
      res.status(200).json({ status: 'success', data: { users } })
    } catch (err) {
      next(err)
    }
  }
}

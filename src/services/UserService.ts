import { UserRepository } from '../repositories/UserRepository'
import { TUserRequest } from '../types/types/user'

export type { Request, Response } from 'express'

export class UserService {
  static sighIn = async (user: TUserRequest) => {
    return await UserRepository.sighIn(user)
  }
}

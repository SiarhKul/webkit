import { UserRepository } from '../repositories/UserRepository'

export type { Request, Response } from 'express'

export class UserService {
  static sighIn = async (user: any) => {
    return await UserRepository.sighIn(user)
  }
}

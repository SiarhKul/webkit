import { UserRepository } from '../repositories/UserRepository'
import { TUserRequest } from '../types/types/user'

export type { Request, Response } from 'express'

export class UserService {
  static async sighIn(user: TUserRequest) {
    return await UserRepository.sighIn(user)
  }

  static async getAllUsers() {
    return await UserRepository.getAllUsers()
  }

  static async deleteUserBy(id: number) {
    return await UserRepository.deleteUserById(id)
  }
}

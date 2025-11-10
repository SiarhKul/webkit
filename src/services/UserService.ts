import { UserRepository } from '../repositories/UserRepository'
import { User } from '../entity/User'

export type { Request, Response } from 'express'

export class UserService {
  static async sighIn(user: User): Promise<User> {
    return await UserRepository.sighIn(user)
  }

  static async getAllUsers(): Promise<User[]> {
    return await UserRepository.getAllUsers()
  }

  static async getUserById(id: number): Promise<User> {
    return await UserRepository.getUserById(id)
  }

  static async updateUserById(
    id: number,
    userData: Partial<User>
  ): Promise<User> {
    return await UserRepository.updateUserById(id, userData)
  }

  static async deleteUserBy(id: number): Promise<void> {
    return await UserRepository.deleteUserById(id)
  }
}

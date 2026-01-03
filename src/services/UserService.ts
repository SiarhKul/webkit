import { UserRepository } from '../repositories/UserRepository'
import { User } from '../entity/User'
import { GrpcNotificationService } from './grpcNotificationService'

export type { Request, Response } from 'express'

export class UserService {
  static grpcNotificationService = new GrpcNotificationService()

  static async sighIn(user: User): Promise<User> {
    const signedUser = await UserRepository.sighIn(user)

    await this.grpcNotificationService.sendNotification()

    return signedUser
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

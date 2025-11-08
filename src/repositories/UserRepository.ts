import { User } from '../entity/User'
import { AppDataSource } from '../integrations/data-source'
import { QueryFailedError } from 'typeorm'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'
import { TUserRequest } from '../types/types/user'

export class UserRepository {
  static async sighIn(user: TUserRequest): Promise<User> {
    try {
      const userRepository = AppDataSource.getRepository(User)

      return await userRepository.save(user)
    } catch (e: unknown) {
      if (e instanceof QueryFailedError) {
        throw new AppError(409, ErrorCodes.DUPLICATE_DATA, e.message)
      }
      throw e
    }
  }

  static async getAllUsers() {
    return await AppDataSource.getRepository(User).find()
  }

  static async deleteUserById(id: number): Promise<void> {
    const result = await AppDataSource.getRepository(User).delete(id)
    console.log('result', result)
    if (!result.affected || result.affected === 0) {
      throw new AppError(404, ErrorCodes.ENTITY_NOT_FOUND, 'User not found')
    }
  }

  static async test(user: User) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('My error'))
        resolve([{ id: 1, ...user }])
      }, 2000)
    })
  }
}

import { User } from '../entity/User'
import { AppDataSource } from '../integrations/data-source'
import { QueryFailedError } from 'typeorm'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'

export class UserRepository {
  static async sighIn(user: any) {
    try {
      const userRepository = AppDataSource.getRepository(User)
      //todo: Add eslint
      return await userRepository.save(user)
    } catch (e: unknown) {
      if (e instanceof QueryFailedError) {
        throw new AppError(409, ErrorCodes.DUPLICATE_DATA, e.message)
      }
      throw e
    }
  }

  static async test(user: User) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        // reject(new Error('My error'))
        resolve([{ id: 1, ...user }])
      }, 2000)
    })
  }
}

import { User } from '../entity/User'
import { AppDataSource } from '../integrations/postgress/data-source'
import { QueryFailedError } from 'typeorm'
import { AppError } from '../sharable/AppError'
import { ErrorCodes } from '../sharable/jsend/ErrorCodes'

export class UserRepository {
  static userRep = AppDataSource.getRepository(User)

  static async sighIn(user: User) {
    try {
      return await this.userRep.save<User>(user)
    } catch (e: unknown) {
      if (e instanceof QueryFailedError) {
        throw new AppError(409, ErrorCodes.DUPLICATE_DATA, e.message)
      }
      throw e
    }
  }

  static async getAllUsers(): Promise<User[]> {
    return await this.userRep.find()
  }

  static async getUserById(id: number): Promise<User> {
    const user = await this.userRep.findOne({
      where: { id },
    })
    console.log('user', user)
    if (!user) {
      throw new AppError(404, ErrorCodes.ENTITY_NOT_FOUND, 'User not found')
    }
    return user
  }

  static async updateUserById(
    id: number,
    userData: Partial<User>
  ): Promise<User> {
    try {
      const user = await this.getUserById(id)
      Object.assign(user, userData)
      return await this.userRep.save(user)
    } catch (e: unknown) {
      if (e instanceof QueryFailedError) {
        throw new AppError(409, ErrorCodes.DUPLICATE_DATA, e.message)
      }
      if (e instanceof AppError) {
        throw e
      }
      throw e
    }
  }

  static async deleteUserById(id: number): Promise<void> {
    const result = await this.userRep.delete(id)
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

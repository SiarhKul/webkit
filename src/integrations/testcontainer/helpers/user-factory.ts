import { User } from '../../../entity/User'
import { Roles, Positions } from '../../../types/enums/index'

export interface UserFactoryOptions {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  role?: Roles
  position?: Positions
}

export function createUserData(options: UserFactoryOptions = {}): User {
  const user = new User()
  user.firstName = options.firstName ?? 'John'
  user.lastName = options.lastName ?? 'Doe'
  user.email = options.email ?? `john.doe.${Date.now()}@example.com`
  user.password = options.password ?? 'hashedPassword123'
  user.role = options.role ?? Roles.USER
  user.position = options.position ?? Positions.MANAGER
  return user
}

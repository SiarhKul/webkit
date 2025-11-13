import { describe, it, expect, beforeEach } from 'vitest'
import { DataSource } from 'typeorm'
import { UserRepository } from '../UserRepository.js'
import { User } from '../../entity/User.js'
import {
  getTestDataSource,
  resetTestDatabase,
} from '../../integrations/test/test-data-source'
import { createUserData } from '../../integrations/test/helpers/user-factory.js'
import { Roles, Positions } from '../../types/enums/index.js'

describe('UserRepository', () => {
  let testDataSource: DataSource

  beforeEach(async () => {
    testDataSource = await getTestDataSource()
    await resetTestDatabase()

    // Replace the repository with test database repository
    ;(UserRepository as any).userRep = testDataSource.getRepository(User)
  })

  describe('getAllUsers', () => {
    it('should return an empty array when no users exist', async () => {
      const users = await UserRepository.getAllUsers()
      expect(users).toEqual([])
      expect(users).toHaveLength(0)
    })

    it('should return all users when users exist', async () => {
      // Arrange: Create test users
      const user1 = createUserData({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        role: Roles.USER,
        position: Positions.QA,
      })
      const user2 = createUserData({
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        role: Roles.ADMIN,
        position: Positions.ENGINEER,
      })

      await testDataSource.getRepository(User).save([user1, user2])

      // Act
      const users = await UserRepository.getAllUsers()

      // Assert
      expect(users).toHaveLength(2)
      expect(users[0]).toMatchObject({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        role: Roles.USER,
        position: Positions.QA,
      })
      expect(users[1]).toMatchObject({
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        role: Roles.ADMIN,
        position: Positions.ENGINEER,
      })
    })

    it('should return all created users', async () => {
      // Arrange: Create multiple users
      const usersToCreate = [
        createUserData({ firstName: 'First', email: 'first@example.com' }),
        createUserData({ firstName: 'Second', email: 'second@example.com' }),
        createUserData({ firstName: 'Third', email: 'third@example.com' }),
      ]

      const savedUsers = await testDataSource
        .getRepository(User)
        .save(usersToCreate)

      // Act
      const users = await UserRepository.getAllUsers()

      // Assert
      expect(users).toHaveLength(3)
      // Verify all users are returned (order may vary)
      const userEmails = users.map((u) => u.email).sort()
      const expectedEmails = savedUsers.map((u) => u.email).sort()
      expect(userEmails).toEqual(expectedEmails)
    })

    it('should return all user properties correctly', async () => {
      // Arrange
      const userData = createUserData({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'testPassword123',
        role: Roles.ADMIN,
        position: Positions.DEV_OPS,
      })

      const savedUser = await testDataSource.getRepository(User).save(userData)

      // Act
      const users = await UserRepository.getAllUsers()

      // Assert
      expect(users).toHaveLength(1)
      const user = users[0]
      expect(user.id).toBe(savedUser.id)
      expect(user.firstName).toBe('Test')
      expect(user.lastName).toBe('User')
      expect(user.email).toBe('test@example.com')
      expect(user.password).toBe('testPassword123')
      expect(user.role).toBe(Roles.ADMIN)
      expect(user.position).toBe(Positions.DEV_OPS)
    })

    it('should handle large number of users', async () => {
      // Arrange: Create 100 users
      const usersToCreate = Array.from({ length: 100 }, (_, i) =>
        createUserData({
          firstName: `User${i}`,
          email: `user${i}@example.com`,
        })
      )

      await testDataSource.getRepository(User).save(usersToCreate)

      // Act
      const users = await UserRepository.getAllUsers()

      // Assert
      expect(users).toHaveLength(100)
    })
  })
})

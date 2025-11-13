import { describe, it, expect, beforeEach } from 'vitest'
import { DataSource } from 'typeorm'
import {
  getTestDataSource,
  resetTestDatabase,
} from '../integrations/testcontainer/test-data-source'
import { UserRepository } from '../repositories/UserRepository'
import { createUserData } from '../helpers/user-factory'
import { Positions, Roles } from '../types/enums/index'
import { User } from '../entity/User'

describe('UserRepository', () => {
  let testDataSource: DataSource

  beforeEach(async () => {
    testDataSource = await getTestDataSource()
    await resetTestDatabase()
    UserRepository.userRep = testDataSource.getRepository(User)
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
      expect(users[0]).toMatchObject(user1)
      expect(users[1]).toMatchObject(user2)
    })
  })
})

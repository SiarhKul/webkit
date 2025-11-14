import { describe, it, expect, beforeEach } from 'vitest'
import supertest from 'supertest'
import { app } from '../app'
import { DataSource } from 'typeorm'
import {
  getTestDataSource,
  resetTestDatabase,
} from '../integrations/testcontainer/test-data-source'
import { User } from '../entity/User'
import { createUserData } from '../helpers/user-factory'
import { Positions, Roles } from '../types/enums'
import { UserRepository } from '../repositories/UserRepository'

const request = supertest(app)

describe('UserController E2E', () => {
  let testDataSource: DataSource

  beforeEach(async () => {
    testDataSource = await getTestDataSource()
    await resetTestDatabase()
    UserRepository.userRep = testDataSource.getRepository(User)
  })

  describe('GET /user', () => {
    it('should return an empty array when no users exist', async () => {
      const response = await request.get('/user')
      expect(response.status).toBe(200)
      expect(response.body.data).toEqual([])
    })

    it('should return all users when users exist', async () => {
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

      const response = await request.get('/user')
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(2)
    })
  })

  describe('GET /user/:id', () => {
    it('should return a user by id', async () => {
      const userData = createUserData({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        role: Roles.USER,
        position: Positions.QA,
      })
      const user = await testDataSource.getRepository(User).save(userData)

      const response = await request.get(`/user/${user.id}`)
      expect(response.status).toBe(200)
      expect(response.body.data.id).toBe(user.id)
    })

    it('should return 404 when user not found', async () => {
      const response = await request.get('/user/999')
      expect(response.status).toBe(404)
    })
  })

  describe('POST /user', () => {
    it('should create a new user', async () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
        role: Roles.USER,
        position: Positions.QA,
      }

      const response = await request.post('/user').send(newUser)
      expect(response.status).toBe(200)
      expect(response.body.data).toMatchObject(newUser)
    })

    it('should return 422 on validation error', async () => {
      const newUser = {
        firstName: 'Test',
        // Missing lastName and other required fields
      }

      const response = await request.post('/user').send(newUser)
      expect(response.status).toBe(422)
    })
  })

  describe('PUT /user/:id', () => {
    it('should update a user', async () => {
      const userData = createUserData({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        role: Roles.USER,
        position: Positions.QA,
      })
      const user = await testDataSource.getRepository(User).save(userData)

      const updatedData = {
        firstName: 'Alicia',
      }

      const response = await request.put(`/user/${user.id}`).send(updatedData)
      expect(response.status).toBe(200)
      expect(response.body.data.firstName).toBe('Alicia')
    })
  })

  describe('DELETE /user/:id', () => {
    it('should delete a user', async () => {
      const userData = createUserData({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        role: Roles.USER,
        position: Positions.QA,
      })
      const user = await testDataSource.getRepository(User).save(userData)

      const response = await request.delete(`/user/${user.id}`)
      expect(response.status).toBe(204)

      const deletedUser = await testDataSource
        .getRepository(User)
        .findOneBy({ id: user.id })
      expect(deletedUser).toBeNull()
    })
  })
})

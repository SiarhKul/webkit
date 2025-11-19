import { describe, it, expect } from 'vitest'
import supertest from 'supertest'
import { app } from '../app'

const request = supertest(app)

describe('Rate Limiter', () => {
  it('should return a "Too many calls" error when the rate limit is exceeded', async () => {
    const requests = Array(6)
      .fill(0)
      .map(() => request.get('/user'))

    const responses = await Promise.all(requests)

    const rateLimitedResponse = responses.find(
      (response) => response.status === 429
    )

    expect(rateLimitedResponse).toBeDefined()
    expect(rateLimitedResponse.body).toEqual({
      status: 'error',
      message: 'Too many calls, please try again later',
    })
  }, 15000)
})

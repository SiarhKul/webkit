import { afterAll, beforeAll } from 'vitest'

beforeAll(() => {
  console.log(1)
})

afterAll(() => {
  console.log(2)
})

import { AppDataSource } from '../integrations/data-source.js'
import { User } from '../entity/User.js'
import { Roles, Positions } from '../types/enums/index.js'
import { faker } from '@faker-js/faker'

// Get random enum value
function getRandomEnumValue<T>(enumObject: T): T[keyof T] {
  const values = Object.values(enumObject as object)
  return values[Math.floor(Math.random() * values.length)] as T[keyof T]
}

// Generate a single fake user
function generateFakeUser(): User {
  const user = new User()
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  user.firstName = firstName
  user.lastName = lastName
  user.email = faker.internet.email({ firstName, lastName })
  user.password = faker.internet.password({ length: 12 })
  user.role = getRandomEnumValue(Roles)
  user.position = getRandomEnumValue(Positions)

  return user
}

// Main seed function
async function seedUsers(count: number = 50): Promise<void> {
  try {
    console.log('Initializing database connection...')
    await AppDataSource.initialize()
    console.log('Database connection initialized successfully')

    const userRepository = AppDataSource.getRepository(User)

    // Check if users already exist
    const existingUsersCount = await userRepository.count()
    console.log(`Existing users in database: ${existingUsersCount}`)

    console.log(`Generating ${count} fake users...`)
    const users: User[] = []

    for (let i = 0; i < count; i++) {
      const user = generateFakeUser()
      users.push(user)
    }

    console.log('Saving users to database...')
    await userRepository.save(users)
    console.log(`Successfully created ${count} users!`)

    const totalUsers = await userRepository.count()
    console.log(`Total users in database: ${totalUsers}`)

    await AppDataSource.destroy()
    console.log('Database connection closed')
  } catch (error) {
    console.error('Error seeding users:', error)
    process.exit(1)
  }
}

// Get count from command line argument or use default
const count = process.argv[2] ? parseInt(process.argv[2], 10) : 50

if (isNaN(count) || count <= 0) {
  console.error('Invalid count. Please provide a positive number.')
  process.exit(1)
}

// Run the seed function
void seedUsers(count)

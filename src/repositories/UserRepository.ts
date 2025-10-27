export class UserRepository {
  static async sighIn(user: any) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        // reject(new Error('My error'))

        resolve([{ id: 1, ...user }])
      }, 2000)
    })
  }
}

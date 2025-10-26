export type { Request, Response } from 'express'

export class UserService {
    static sighIn = async (user: any) => {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([{ id: 1, ...user }])
            }, 2000)
        })
    }
}

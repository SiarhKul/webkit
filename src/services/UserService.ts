export type { Request, Response } from 'express'

export class UserService {
    static sighIn = (user: any) => {
        console.log('1111111111', user)
    }
}

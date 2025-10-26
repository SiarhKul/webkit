import type { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'

export class UserController {
    static sighIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await UserService.sighIn(req.body)
            res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    }
}

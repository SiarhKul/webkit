import type { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'

export class UserController {
    static sighIn = (req: Request, res: Response, next: NextFunction) => {
        try {
            UserService.sighIn(req.body)

            res.status(200).json({ ok: true })
        } catch (err) {
            next(err)
        }
    }
}

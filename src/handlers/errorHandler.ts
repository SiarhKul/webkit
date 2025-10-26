import { type Request, type Response, type NextFunction } from 'express'
import { ErrorResponse } from '../sharable/jsend/ErrorResponse'

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return res.status(500).json(
        new ErrorResponse({
            code: 1,
            name: 'Internal Server Error',
            message: 'An unknown and unexpected error occurred.',
        })
    )
}

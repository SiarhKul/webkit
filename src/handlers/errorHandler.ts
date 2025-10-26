import { type Request, type Response, type NextFunction } from 'express'
import { ErrorResponse } from '../sharable/jsend/ErrorResponse'

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err)
    return res.status(500).json(
        new ErrorResponse({
            type: 'UNKNOWN ERROR',
            name: 'Unknown error',
            message: 'The services handled an unknown error',
        })
    )
}

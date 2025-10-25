import { ErrorResponse } from '../sharable/jsend/ErrorResponse'

export type { Request, Response, NextFunction } from 'express'

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(500).json(
        new ErrorResponse({ errorMessage: 'Something went wrong' })
    )
}

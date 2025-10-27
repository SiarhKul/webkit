import { ErrorCodes } from './jsend/ErrorCodes'

export class AppError extends Error {
    readonly status: 'fail' | 'error'
    readonly statusCode: number
    readonly code: ErrorCodes
    constructor(
        statusCode: number,
        code: ErrorCodes,
        message: string,
        public readonly isOperational: boolean = true
    ) {
        super(message)
        this.code = code
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

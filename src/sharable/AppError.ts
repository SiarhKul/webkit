import { ErrorCodes } from './jsend/ErrorCodes'

export class AppError extends Error {
    public readonly status: 'fail' | 'error'

    constructor(
        public readonly statusCode: number,
        public readonly code: ErrorCodes,
        message: string,
        public readonly isOperational: boolean = true
    ) {
        super(message)

        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    }
}

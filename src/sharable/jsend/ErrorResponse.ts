export class ErrorResponse<T extends Record<string, unknown>> {
    status: 'error' = 'error'
    error: {
        name: string
        message: string
        type: string
        data?: unknown
    }

    constructor(options: {
        name: string
        message: string
        type: string
        data?: T
    }) {
        this.error = {
            name: options.name,
            message: options.message,
            type: options.type,
            data: options.data,
        }
    }
}

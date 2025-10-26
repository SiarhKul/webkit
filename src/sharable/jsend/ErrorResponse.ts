export class ErrorResponse<T extends Record<string, unknown>> {
    status: 'error' = 'error'
    error: {
        name: string
        message: string
        code: number
        data?: unknown
    }

    constructor(options: {
        name: string
        message: string
        code: number
        data?: T
    }) {
        this.error.name = options.name
        this.error.message = options.message
        this.error.code = options.code

        if (options.data) {
            this.error.data = options.data
        }
    }
}

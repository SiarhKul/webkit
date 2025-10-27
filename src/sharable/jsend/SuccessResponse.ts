export class FailResponse<T extends Record<string, unknown>> {
    status: 'success' = 'success'
    data: T

    constructor(data: T) {
        this.data = data
    }
}

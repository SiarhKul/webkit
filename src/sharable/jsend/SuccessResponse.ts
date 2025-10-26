export class FailResponse<T extends Record<string, unknown>> {
    status: 'fail' = 'fail'
    data: T

    constructor(data: T) {
        this.data = data
    }
}

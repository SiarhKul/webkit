export class ErrorResponse {
    status: 'error'
    data: {}
    constructor(data: Record<string, unknown>) {
        this.data = data
    }
}

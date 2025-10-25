export class SuccessResponse {
    status: 'success'
    data: {}
    constructor(data: Record<string, unknown>) {
        this.data = data
    }
}

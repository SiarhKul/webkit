export class SuccessResponse<T> {
  status = 'success' as const
  data: T

  constructor(data: T) {
    this.data = data
  }
}

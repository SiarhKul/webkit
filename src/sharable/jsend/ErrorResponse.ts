export class ErrorResponse<T extends Record<string, unknown>> {
  status = 'error' as const
  error: {
    name: string
    message: string
    code: string
    data?: T
  }

  constructor(options: {
    name: string
    message: string
    code: string
    data?: T
  }) {
    this.error = {
      name: options.name,
      message: options.message,
      code: options.code,
      data: options.data,
    }
  }
}

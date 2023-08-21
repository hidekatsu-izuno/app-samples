export class BusinessError extends Error {
  public options: Record<string, any>

  constructor(message: string, opts?: Record<string, any>) {
    super(message, opts && {
      cause: opts.cause,
    })
    this.options = opts ? { ...opts } : {}
    if (this.options.cause) {
      delete this.options.cause
    }
  }
}

import winston from "winston"

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ]
})

declare module 'h3' {
  interface EventContext {
    info: typeof logger.info
    warn: typeof logger.warn
    error: typeof logger.error
  }
}

export default defineEventHandler(event => {
  const method = getMethod(event)
  const path = getRequestPath(event)

  const child = logger.child({ method, path })
  event.context.info = child.info.bind(child)
  event.context.warn = child.warn.bind(child)
  event.context.error = child.error.bind(child)
})

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
  event.context.info = logger.info.bind(logger)
  event.context.warn = logger.warn.bind(logger)
  event.context.error = logger.error.bind(logger)
})

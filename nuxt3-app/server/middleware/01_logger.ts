import crypto from "node:crypto"
import type { H3Event } from "h3"
import { default as pino, stdTimeFunctions } from "pino"

const runtimeConfig = useRuntimeConfig()

export const logger = pino({
  level: runtimeConfig.logger.level || "info",
  timestamp: stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { level: label }
    },
  },
})

declare module "h3" {
  interface H3EventContext {
    logger: typeof logger
    cause?: Error
  }
}

export default defineEventHandler((event) => {
  const res = event.node.res

  const startTime = Date.now()
  const reqInfo = serializeRequest(event)
  event.context.logger = logger.child({
    req: reqInfo,
  })

  const onResponseComplete = (err: any) => {
    res.removeListener("close", onResponseComplete)
    res.removeListener("finish", onResponseComplete)
    res.removeListener("error", onResponseComplete)

    const resInfo = serializeResponse(event)
    resInfo.responseTime = Date.now() - startTime
    const httpLogger = logger.child({
      req: reqInfo,
      res: resInfo,
    })

    if (res.statusCode >= 500) {
      httpLogger.error({ err: err || event.context.cause }, "finished with error")
    } else if (res.statusCode >= 400) {
      httpLogger.warn({ err: err || event.context.cause }, "finished with warning")
    } else if (err || event.context.cause) {
      httpLogger.error({ err: err || event.context.cause }, "finished with error")
    } else {
      httpLogger.info("finished successfully")
    }
  }

  res.on("close", onResponseComplete)
  res.on("finish", onResponseComplete)
  res.on("error", onResponseComplete)
})

function serializeRequest(event: H3Event) {
  const id = crypto.randomUUID()
  const headers = getRequestHeaders(event)
  return {
    id,
    method: event.method,
    url: getRequestURL(event),
    ip: getRequestHost(event, { xForwardedHost: true }),
    headers: ["host", "user-agent", "referer", "cookie"].reduce((dest, key) => {
      dest[key] = headers[key]
      return dest
    }, {} as Record<string, any>),
  }
}

function serializeResponse(event: H3Event) {
  const statusCode = getResponseStatus(event)
  const headers = getResponseHeaders(event)

  return {
    statusCode,
    responseTime: 0,
    headers: ["content-type", "content-length"].reduce((dest, key) => {
      dest[key] = headers[key]
      return dest
    }, {} as Record<string, any>),
  }
}

import type { IncomingMessage, ServerResponse } from "http"
import { default as pino, stdTimeFunctions } from "pino"

const runtimeConfig = useRuntimeConfig()

const logger = pino({
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
  const req = event.node.req
  const res = event.node.res

  const startTime = Date.now()
  const reqInfo = serializeRequest(req)
  event.context.logger = logger.child({
    req: reqInfo,
  })

  const onResponseComplete = (err: any) => {
    res.removeListener("close", onResponseComplete)
    res.removeListener("finish", onResponseComplete)
    res.removeListener("error", onResponseComplete)

    const resInfo = serializeResponse(res)
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

function serializeRequest(req: IncomingMessage) {
  let ip = req.socket.remoteAddress

  const xFowardedFor = req.headers["x-forwarded-for"]
  if (xFowardedFor && runtimeConfig.logger?.trustedProxies?.size > 0) {
    const array = Array.isArray(xFowardedFor) ? xFowardedFor : [xFowardedFor]
    loop:
    for (const entry of array) {
      const items = entry.split(/,/g).map(v => v.trim())
      if (items.length > 0 && items[0]) {
        for (let i = 1; i < items.length; i++) {
          if (runtimeConfig.logger.trustedProxies.has(items[i])) {
            ip = items[0]
            break loop
          }
        }
      }
    }
  }

  const id = crypto.randomUUID()
  return {
    id,
    method: req.method,
    url: req.url,
    ip,
    headers: {
      host: req.headers.host,
      "user-agent": req.headers["user-agent"],
      referer: req.headers.referer,
      cookie: req.headers.cookie,
    },
  }
}

function serializeResponse(res: ServerResponse) {
  return {
    statusCode: res.statusCode,
    responseTime: 0,
    headers: {
      "content-type": res.getHeader("content-type"),
      "content-length": res.getHeader("content-length"),
    },
  }
}

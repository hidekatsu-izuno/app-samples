import type { IncomingMessage, ServerResponse } from "http"
import { default as pino, stdTimeFunctions } from "pino"

const runtimeConfig = useRuntimeConfig()

const logger = pino({
  level: runtimeConfig.logger.level || "info",
  timestamp: stdTimeFunctions.isoTime,
  formatters: {
    level(label, number) {
      return { level: label }
    },
  },
})

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

    if (err) {
      httpLogger.error({ err }, "finished with error")
    } else if (res.statusCode >= 500) {
      httpLogger.error("finished with error")
    } else if (res.statusCode >= 400) {
      httpLogger.warn("finished with warning")
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
  if (xFowardedFor) {
    let xFowardedForStr = Array.isArray(xFowardedFor) ? xFowardedFor[0] : xFowardedFor
    xFowardedForStr = xFowardedForStr.split(/,/)[0].trim()
    if (xFowardedForStr) {
      ip = xFowardedForStr
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

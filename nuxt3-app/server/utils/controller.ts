import type { EventHandler } from "h3"
import { AppSessionKey, AppSessionConfig, AppSession } from "./session"
import { withSqlTransaction } from "./database"
import { ZodError } from "zod"

export function defineAppHandler(handler: EventHandler) {
  return defineEventHandler(async (event) => {
    const path = getRequestPath(event)
    if (!/^\/api\/auth\/.*/.test(path)) {
      const session = await useSession<AppSession>(event, AppSessionConfig)
      if (session.data?.userId) {
        (event as any)[AppSessionKey] = session.data
      } else {
        throw createError({ statusCode: 401 })
      }
    }

    try {
      return await withSqlTransaction(handler)(event)
    } catch (err) {
      if (err instanceof ZodError) {
        err = createError({ statusCode: 400, cause: err })
      }
      console.error(err)
      return err
    }
  })
}

import type { EventHandler } from "h3"
import { SessionKey, SessionConfig, SessionData } from "./session"
import { ZodError } from "zod"

export function defineAppHandler(handler: EventHandler) {
  return defineEventHandler(async (event) => {
    const path = getRequestPath(event)
    if (!/^\/api\/auth\/.*/.test(path)) {
      const session = await useSession<SessionData>(event, SessionConfig)
      if (session.data?.userId) {
        (event as any)[SessionKey] = session.data
      } else {
        throw createError({ statusCode: 401 })
      }
    }

    try {
      return await handler(event)
    } catch (err) {
      if (err instanceof ZodError) {
        err = createError({ statusCode: 400, cause: err })
      }
      console.error(err)
      return err
    }
  })
}

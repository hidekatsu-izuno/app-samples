import type { EventHandler } from "h3"
import { SessionKey, SessionConfig, SessionData } from "./session"

export default async function defineAppHandler(handler: EventHandler) {
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
      return err
    }
  })
}

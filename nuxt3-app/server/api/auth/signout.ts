import { defineAppHandler } from "~/server/utils/controller"
import { SessionConfig } from "~/server/utils/session"

export default defineAppHandler(async (event) => {
  await clearSession(event, SessionConfig)
  return {}
})

import defineAppHandler from "~/server/utils/defineAppHandler"
import { SessionConfig } from "~/server/utils/session"

export default defineAppHandler(async (event) => {
  await clearSession(event, SessionConfig)
  return {}
})

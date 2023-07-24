import { defineAppHandler } from "~/server/utils/controller"
import { AppSessionConfig } from "~/server/utils/session"

export default defineAppHandler(async (event) => {
  await clearSession(event, AppSessionConfig)
  return {}
})

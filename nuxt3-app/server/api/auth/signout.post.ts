import { defineAction } from "~/server/utils/action"
import { AppSessionConfig } from "~/server/utils/session"

export default defineAction(async (event) => {
  await clearSession(event, AppSessionConfig)
  return {}
})

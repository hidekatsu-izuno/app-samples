import { defineAction } from "~/server/utils/action"
import { AppSessionConfig } from "~/server/utils/session"

export default defineAction({
  session: false,
  transaction: false,
}, async (event) => {
  await clearSession(event, AppSessionConfig)
  return {}
})

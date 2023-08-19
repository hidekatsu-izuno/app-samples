import { AppSessionConfig } from "../../middleware/02_session"

export default defineAction(async (event) => {
  await clearSession(event, AppSessionConfig)
  return {}
})

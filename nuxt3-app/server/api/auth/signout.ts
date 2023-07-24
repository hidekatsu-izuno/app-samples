import { defineController } from "~/server/utils/controller"
import { AppSessionConfig } from "~/server/utils/session"

export default defineController({
  session: false,
  transaction: false,

  async post(event) {
    await clearSession(event, AppSessionConfig)
    return {}
  }
})

import { defineAction } from "~/server/utils/action"

export default defineAction(async (event) => {
  await event.context.session.clear()
  return {}
})

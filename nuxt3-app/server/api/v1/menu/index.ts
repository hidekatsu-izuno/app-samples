import { authorize } from "~~/server/utils/user"

export default defineEventHandler(async (event) => {
  const user = authorize(event)

  return {
    user,
    menus: []
  }
})

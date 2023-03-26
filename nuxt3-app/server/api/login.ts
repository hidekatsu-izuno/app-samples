import { useSessionUser } from "@/server/utils/session"
import { LoginSchema } from "~~/utils/schemas"

export default defineEventHandler(async (event) => {
  const data = await readBody(event)
  const parsed = LoginSchema.parse(data)

  const session = useSessionUser(event)
  session.userId = parsed.userId

  return {
    redirect: "/v1/main"
  }
})

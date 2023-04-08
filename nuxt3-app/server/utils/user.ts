import { H3Event } from "h3"
import { usePgClient } from "./database"

export async function authorize(event: H3Event, roles?: string[]) {
  const sessionUser = useSessionUser(event)
  if (!sessionUser.userId) {
    throw createError({ statusCode: 401 })
  }

  const client = await usePgClient(event)
  client.query("select * from user where userId = ?", [ sessionUser.userId ])

  return {
    userId: sessionUser.userId
  }
}

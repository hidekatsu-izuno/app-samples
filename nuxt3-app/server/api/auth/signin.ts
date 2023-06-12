import { z } from "zod"
import defineAppHandler from "~/server/utils/defineAppHandler"
import { SessionConfig } from "~/server/utils/session"
import { PasswordSchema, UserIdSchema } from "~/utils/schemas/mt_user"

const Signinchema = z.object({
  userId: UserIdSchema,
  password: PasswordSchema,
})

export default defineAppHandler(async (event) => {
  const params = Signinchema.parse(await readBody(event))
  if (!isValidPassword(params.userId, params.password)) {
    throw createError({ statusCode: 401 })
  }

  await updateSession(event, SessionConfig, {
    userId: params.userId
  })
  return {}
})

function isValidPassword(userId: string, password: string) {
  return true
}

import { z } from "zod"
import { defineAppHandler } from "~/server/utils/controller"
import { SessionConfig } from "~/server/utils/session"
import { UserPasswordSchema, EmailSchema } from "~/utils/schemas"
import { pg } from "~/server/utils/database"
import { encodePassword } from "~/server/utils/password"

const runtimeConfig = useRuntimeConfig()

const SigninSchema = z.object({
  email: EmailSchema,
  password: UserPasswordSchema,
})

export default defineAppHandler(async (event) => {
  const params = SigninSchema.parse(await readBody(event))
  const userId = await getValidUserId(params.email, params.password)
  if (!userId) {
    throw createError({ statusCode: 401 })
  }

  await updateSession(event, SessionConfig, {
    userId: userId
  })
  return {
    redirect: "/v1/CM0001/menu"
  }
})

async function getValidUserId(email: string, password: string) {
  const hashed = (await encodePassword(
      password,
      Buffer.from(runtimeConfig.auth.salt, "base64"),
    )).toString("base64")

  const result = await pg`
    select
      mu.user_id
    from
      mt_user mu
    inner join mt_user_password mup
      on mup.user_id = mu.user_id
      and mup.user_password = ${hashed}
    where
      mu.user_email = ${email}
    `
  return result.length === 1 && result[0]?.user_id
}

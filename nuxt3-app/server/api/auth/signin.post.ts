import { z } from "zod"
import { SqlConnection, defineAction, useSqlConnection } from "~/server/utils/action"
import { AppSessionConfig } from "~/server/utils/session"
import { UserPasswordSchema, EmailSchema } from "~/utils/schemas"
import { encodePassword } from "~/server/utils/security"

const runtimeConfig = useRuntimeConfig()

const SigninSchema = z.object({
  email: EmailSchema,
  password: UserPasswordSchema
})

export default defineAction({
  session: false,
  transaction: false
}, async (event) => {
  const params = SigninSchema.parse(await readBody(event))

  const con = useSqlConnection(event)
  const userId = await getValidUserId(con, params.email, params.password)
  if (!userId) {
    throw createError({ statusCode: 401 })
  }

  await updateSession(event, AppSessionConfig, {
    userId
  })

  return {
    redirect: "/v1/CM0001/top"
  }
})

async function getValidUserId(con: SqlConnection, email: string, password: string) {
  const hashed = (await encodePassword(
    password,
    Buffer.from(runtimeConfig.auth.salt, "base64")
  )).toString("base64")

  const result = await con`
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
  if (result.length === 1) {
    return result[0]?.user_id
  } else {
    console.log(hashed)
  }
}

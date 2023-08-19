import { z } from "zod"
import { SqlConnection, defineAction, useSqlConnection } from "~/server/utils/action"
import { AppSessionConfig } from "~/server/utils/session"
import { UserPasswordSchema, EmailSchema } from "~/utils/schemas"
import { encodePassword } from "~/server/utils/security"

const SigninSchema = z.object({
  email: EmailSchema,
  password: UserPasswordSchema,
})

export default defineAction({
  session: false,
  transaction: false,
}, async (event) => {
  const params = SigninSchema.parse(await readBody(event))

  const con = useSqlConnection(event)
  const userId = await getValidUserId(con, params.email, params.password)
  if (!userId) {
    throw createError({ statusCode: 401 })
  }

  await updateSession(event, AppSessionConfig, {
    userId,
  })

  return {
    redirect: "/v1/CM0001/top",
  }
})

async function getValidUserId(con: SqlConnection, email: string, password: string) {
  const result = await con`
    select
      mu.user_id,
      mup.user_password,
      mup.user_password_salt
    from
      mt_user mu
    inner join mt_user_password mup
      on mup.user_id = mu.user_id
    where
      mu.user_email = ${email}
    `

  if (result.length !== 1) {
    return
  }

  const user = result[0]
  const hashed = await encodePassword(
    password,
    user.user_password_salt,
  )
  if (Buffer.compare(user.user_password, hashed) !== 0) {
    console.log(hashed.toString("hex"), crypto.getRandomValues(Buffer.from(new Uint8Array(16))).toString("hex"))
    return
  }

  return user.user_id
}

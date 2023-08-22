import { z } from "zod"
import { AppSessionConfig } from "../../middleware/02_session"
import { type Sql, useSqlConnection } from "~/server/utils/action"
import { UserPasswordSchema, EmailSchema } from "~/utils/schemas"

const SigninSchema = z.object({
  email: EmailSchema,
  password: UserPasswordSchema,
})

export default defineAction(async (event) => {
  const params = SigninSchema.parse(await readBody(event))

  const sql = useSqlConnection(event)
  const userId = await getValidUserId(sql, params.email, params.password)
  if (!userId) {
    throw createError({ statusCode: 401 })
  }

  await updateSession(event, AppSessionConfig, {
    userId,
  })

  return {
    redirect: "/v1/common/top",
  }
})

async function getValidUserId(sql: Sql, email: string, password: string) {
  const result = await sql`
    select
      mu.user_id,
      mup.user_password
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
    Buffer.from(user.userId.replaceAll("-", ""), "base64"),
  )
  if (Buffer.compare(user.userPassword, hashed) !== 0) {
    console.log(hashed.toString("hex"))
    return
  }

  return user.userId
}

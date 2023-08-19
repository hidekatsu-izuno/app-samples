import { z } from "zod"
import { type SqlConnection, defineAction, useSqlConnection } from "~/server/utils/action"
import { UserPasswordSchema, EmailSchema } from "~/utils/schemas"

const SigninSchema = z.object({
  email: EmailSchema,
  password: UserPasswordSchema,
})

export default defineAction(async (event) => {
  const params = SigninSchema.parse(await readBody(event))

  const con = useSqlConnection(event)
  const userId = await getValidUserId(con, params.email, params.password)
  if (!userId) {
    throw createError({ statusCode: 401 })
  }

  await event.context.session.update({
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
    Buffer.from(user.user_id.replaceAll("-", ""), "base64"),
  )
  if (Buffer.compare(user.user_password, hashed) !== 0) {
    console.log(hashed.toString("hex"))
    return
  }

  return user.user_id
}

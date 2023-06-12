import crypto from "node:crypto"
import { z } from "zod"
import { defineAppHandler } from "~/server/utils/controller"
import { SessionConfig } from "~/server/utils/session"
import { UserPasswordSchema, UserIdSchema } from "~/utils/schemas/items"
import { pg } from "~/server/utils/database"

const runtimeConfig = useRuntimeConfig()

function scrypt(password: string, salt: Buffer, len: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, len, (err, derivedKey) => {
      if (err) {
        reject(err)
      } else {
        resolve(derivedKey)
      }
    })
  })
}

const SigninSchema = z.object({
  userId: UserIdSchema,
  password: UserPasswordSchema,
})

export default defineAppHandler(async (event) => {
  const params = SigninSchema.parse(await readBody(event))
  if (!(await isValidPassword(params.userId, params.password))) {
    throw createError({ statusCode: 401 })
  }

  await updateSession(event, SessionConfig, {
    userId: params.userId
  })
  return {
    redirect: "/v1/CM0001/menu"
  }
})

async function isValidPassword(userId: string, password: string) {
  const hashed = (await scrypt(
      password,
      Buffer.from(runtimeConfig.auth.salt, "base64"),
      16
    )).toString("base64")

  const result = await pg`
    select
      count(*) as cnt
    from
      mt_user mu
    inner join mt_user_password mup
      on mup.user_id = mu.user_id
    where
      mup.user_id = ${userId}
      and mup.user_password = ${hashed}
    `
  return (result.count === 1 && result[0].cnt === 1)
}

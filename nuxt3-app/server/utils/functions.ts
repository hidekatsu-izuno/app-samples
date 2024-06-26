import { scrypt } from "crypto"
import type { H3Event } from "h3"

export * from "../../utils/functions"

export function encodePassword(password: string, salt: Uint8Array): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 16, (err, derivedKey) => {
      if (err) {
        reject(err)
      } else {
        resolve(derivedKey)
      }
    })
  })
}

export async function authorize(event: H3Event, roles: string[]) {
  const sql = useSqlConnection(event)
  await sql`SELECT 1`
  const user = event.context.session
  if (!user) {
    throw createError({ statusCode: 401 })
  }
  return user
}

import { z } from "zod"
import { UserIdSchema } from "~/utils/schemas"

const schema = z.object({
  userId: UserIdSchema,
})

interface User {
  userId: string,
  userEmail: string,
  userName: string,
  birthDate?: string,
  comment?: string,
  isDeleted: boolean,
  revisionNo: number,
}

export default defineAction(async (event) => {
  await authorize(event, ["admin"])

  const body = await readBody(event)
  const params = schema.parse(body)
  const sql = useSqlConnection(event)

  const result = await sql<User[]>`
    SELECT
      mu.user_id,
      mu.user_email,
      mu.user_name,
      TO_CHAR(mu.birth_date, 'YYYY-MM-DD') as birth_date,
      mu.comment,
      mu.is_deleted,
      mu.revision_no
    FROM
      mt_user mu
    WHERE
      mu.user_id = ${params.userId}
  `
  if (result.length !== 1) {
    return null
  }

  return result[0]
})

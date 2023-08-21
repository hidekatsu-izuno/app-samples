import { z } from "zod"
import { BusinessError } from "~/utils/errors"
import { CommentSchema, DateSchema, EmailSchema, UserNameSchema } from "~/utils/schemas"
import { doTransaction } from "~/server/utils/action"

const schema = z.object({
  userEmail: EmailSchema,
  userName: UserNameSchema,
  birthDate: DateSchema.optional(),
  comment: CommentSchema.optional(),
})

export default defineAction(async (event) => {
  await authorize(event, ["admin"])

  const body = await readBody(event)
  const params = schema.parse(body)

  await doTransaction(event, async () => {
    const sql = useSqlConnection(event)
    const result = await sql`
      INSERT INTO mt_user (
        user_id,
        user_email,
        user_name,
        birth_date,
        is_deleted,
        comment,
        update_time,
        revision_no
      ) VALUES (
        ${crypto.randomUUID()},
        ${params.userEmail},
        ${params.userName},
        ${params.birthDate || null},
        FALSE,
        ${params.comment || null},
        CLOCK_TIMESTAMP(),
        0
      )
    `
    if (result.count !== 1) {
      throw new BusinessError("ユーザー登録に失敗しました。")
    }
  })
  sendNoContent(event)
})

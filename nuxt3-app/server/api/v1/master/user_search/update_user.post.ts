import { z } from "zod"
import { CommentSchema, DateSchema, EmailSchema, PositiveIntSchema, UserIdSchema, UserNameSchema } from "~/utils/schemas"
import { BusinessError } from "~/utils/errors"

const schema = z.object({
  userId: UserIdSchema,
  userEmail: EmailSchema,
  userName: UserNameSchema,
  birthDate: DateSchema.optional(),
  comment: CommentSchema.optional(),
  isDeleted: z.boolean().optional(),
  revisionNo: PositiveIntSchema,
})

export default defineAction(async (event) => {
  await authorize(event, ["admin"])

  const body = await readBody(event)
  const params = schema.parse(body)

  await doTransaction(event, async () => {
    const sql = useSqlConnection(event)

    const result = await sql`
      UPDATE mt_user SET
        user_email = ${params.userEmail},
        user_name = ${params.userName},
        birth_date = ${params.birthDate || null},
        comment = ${params.comment || null},
        is_deleted = ${params.isDeleted ?? false},
        update_time = CLOCK_TIMESTAMP(),
        revision_no = (revision_no + 1) % 2147483647
      WHERE
        user_id = ${params.userId}
        AND revision_no = ${params.revisionNo}
    `
    if (result.count !== 1) {
      throw new BusinessError("ユーザーの更新に失敗しました。")
    }
  })
  sendNoContent(event)
})

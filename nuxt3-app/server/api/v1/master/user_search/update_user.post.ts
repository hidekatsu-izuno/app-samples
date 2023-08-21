import { z } from "zod"
import { CommentSchema, DateSchema, EmailSchema, PositiveIntSchema, UserIdSchema, UserNameSchema } from "~/utils/schemas"

const schema = z.object({
  userId: UserIdSchema,
  userEmail: EmailSchema,
  userName: UserNameSchema,
  birthDate: DateSchema,
  comment: CommentSchema.optional(),
  isDeleted: z.boolean().optional(),
  revisionNo: PositiveIntSchema,
})

export default defineAction(async (event) => {
  await authorize(event, ["admin"])

  const body = await readBody(event)
  const params = schema.parse(body)
  const sql = useSqlConnection(event)

  await sql`
    UPDATE mt_user SET
      user_email = ${params.userEmail},
      user_name = ${params.userName},
      birth_date = ${params.birthDate},
      comment = ${params.comment || null},
      is_deleted = TRUE,
      update_time = CLOCK_TIMESTAMP(),
      revision_no = (revision_no + 1) % 2147483647
    WHERE
      user_id = ${params.userId}
      AND is_deleted = FALSE
      AND revision_no = ${params.revisionNo}
  `
  sendNoContent(event)
})

import { z } from "zod"
import { CommentSchema, DateSchema, EmailSchema, UserIdSchema, UserNameSchema } from "~/utils/schemas"

const schema = z.object({
  userId: UserIdSchema,
  userEmail: EmailSchema,
  userName: UserNameSchema,
  birthDate: DateSchema,
  comment: CommentSchema.optional(),
  isDeleted: z.boolean().optional(),
})

export default defineAction(async (event) => {
  await authorize(event, ["admin"])

  const body = await readBody(event)
  const params = schema.parse(body)
  const sql = useSqlConnection(event)

  await sql`
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
      ${params.userId},
      ${params.userEmail},
      ${params.userName},
      ${params.birthDate},
      FALSE,
      ${params.comment || null},
      CLOCK_TIMESTAMP(),
      0
    )
  `
  sendNoContent(event)
})

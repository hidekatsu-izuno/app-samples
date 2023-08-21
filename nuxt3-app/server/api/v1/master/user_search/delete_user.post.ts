import { z } from "zod"
import { PositiveIntSchema, UserIdSchema } from "~/utils/schemas"
import { BusinessError } from "~/utils/errors"

const schema = z.object({
  userId: UserIdSchema,
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
        is_deleted = TRUE,
        update_time = CLOCK_TIMESTAMP(),
        revision_no = (revision_no + 1) % 2147483647
      WHERE
        user_id = ${params.userId}
        AND is_deleted = FALSE
        AND revision_no = ${params.revisionNo}
    `
    if (result.count !== 1) {
      throw new BusinessError("ユーザーの削除に失敗しました。")
    }
  })

  sendNoContent(event)
})

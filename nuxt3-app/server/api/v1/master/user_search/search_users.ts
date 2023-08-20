import { z } from "zod"
import { PartialEmailSchema, UserNameSchema, DateSchema, CommentSchema, PositiveIntSchema } from "~/utils/schemas"

const schema = z.object({
  userEmail: PartialEmailSchema.optional(),
  userName: UserNameSchema.optional(),
  birthDateFrom: DateSchema.optional(),
  birthDateTo: DateSchema.optional(),
  isDeleted: z.boolean().optional(),
  comment: CommentSchema.optional(),
  pageNo: PositiveIntSchema.optional(),
})

const PAGE_SIZE = 100

export default defineAction(async (event) => {
  const body = await readBody(event)
  const params = schema.parse(body)
  const sql = useSqlConnection(event)

  const result = await sql`
    SELECT
      count(*) over () AS total_count,
      mu.user_id,
      mu.user_email,
      mu.user_name,
      TO_CHAR(mu.birth_date, 'YYYY-MM-DD') AS birth_date,
      mu.is_deleted,
      mu.comment,
      TO_CHAR(mu.update_time at time zone 'UTC', 'YYYY-MM-dd"T"HH24:MI:SS"Z"') AS update_time
    FROM
      mt_user mu
    WHERE
      1 = 1
      ${params.userEmail ? sql`and mu.user_email like '%' || ${params.userEmail} || '%'` : sql``}
      ${params.userName ? sql`and mu.user_name like '%' || ${params.userName} || '%'` : sql``}
      ${params.isDeleted != null ? sql`and mu.is_deleted = ${params.isDeleted} || '%'` : sql``}
      ${params.comment ? sql`and mu.user_email like '%' || ${params.comment} || '%'` : sql``}
    ORDER BY
      mu.user_email
    LIMIT ${PAGE_SIZE} OFFSET ${(params.pageNo ? params.pageNo - 1 : 0) * PAGE_SIZE}
  `
  return {
    pageNo: params.pageNo,
    pageSize: PAGE_SIZE,
    totalCount: (result[0]?.totalCount || 0) as number,
    items: result,
  }
})

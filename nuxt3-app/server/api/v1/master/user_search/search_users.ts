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
      mu.is_deleted
    FROM
      mt_user mu
    WHERE
      1 = 1
      ${params.userEmail ? sql`AND mu.user_email LIKE '%' || ${params.userEmail} || '%'` : sql``}
      ${params.userName ? sql`AND mu.user_name LIKE '%' || ${params.userName} || '%'` : sql``}
      ${params.birthDateFrom ? sql`AND mu.birth_date >= ${params.birthDateFrom}` : sql``}
      ${params.birthDateTo ? sql`AND mu.birth_date <= ${params.birthDateTo}` : sql``}
      ${params.isDeleted != null ? sql`AND mu.is_deleted = ${params.isDeleted}` : sql``}
      ${params.comment ? sql`AND mu.user_email LIKE '%' || ${params.comment} || '%'` : sql``}
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

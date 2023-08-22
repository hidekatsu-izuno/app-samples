export default defineAction(async (event) => {
  const sql = useSqlConnection(event)
  await sql`select 1`.execute()
  return "success"
})

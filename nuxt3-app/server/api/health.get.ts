export default defineAction(async (event) => {
  const con = useSqlConnection(event)
  await con`select 1`.execute()
  return "success"
})

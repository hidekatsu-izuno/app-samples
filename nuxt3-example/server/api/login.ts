import useSessionUser from "../utils/session"

export default defineEventHandler((event) => {
  const session = useSessionUser(event)
  session.userId = "test"
  return session.userId
})

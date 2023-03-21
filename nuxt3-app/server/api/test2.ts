import useSessionUser from "../utils/session"

export default defineEventHandler((event) => {
  const session = useSessionUser(event)

  return { userId: session.userId }
})

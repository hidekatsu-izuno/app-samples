import { AppSession, AppSessionKey } from "~/server/utils/session"

export default defineEventHandler(async (event) => {
  const path = getRequestPath(event)
  if (/^\/(api\/)?v1\//.test(path)) {
    const session = await useSession<AppSession>(event, AppSessionConfig)
    if (session.data?.userId) {
      (event as any)[AppSessionKey] = session.data
    } else {
      throw createError({ statusCode: 401 })
    }
  }
})

import type { SessionConfig } from "h3"

const runtimeConfig = useRuntimeConfig()
export const AppSessionConfig: SessionConfig = {
  password: runtimeConfig.session.password,
  maxAge: runtimeConfig.session.maxAge,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  },
}

export declare type AppSession = {
  userId: string
}

declare module "h3" {
  interface H3EventContext {
    session?: AppSession
  }
}

export default defineEventHandler(async (event) => {
  const path = getRequestPath(event)
  if (/^\/(api\/)?v1\//.test(path)) {
    const session = await getSession<AppSession>(event, AppSessionConfig)
    if (session.data?.userId) {
      event.context.session = session.data
      await updateSession(event, AppSessionConfig)
    } else {
      throw createError({ statusCode: 401 })
    }
  }
})

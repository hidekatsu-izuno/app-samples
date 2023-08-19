import type { SessionConfig, H3Event } from "h3"

export declare type AppSession = {
  userId: string
}

export const AppSessionKey = Symbol.for("AppSessionKey")

export function getAppSession(event: H3Event) {
  return (event as any)[AppSessionKey] ?? ({
    userId: "",
  }) as AppSession
}

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

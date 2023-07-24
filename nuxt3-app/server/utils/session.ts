import { SessionConfig, H3Event } from "h3"

const runtimeConfig = useRuntimeConfig()

export const AppSessionKey = Symbol.for("AppSessionKey")

export const AppSessionConfig: SessionConfig = {
  password: runtimeConfig.session.password,
  maxAge: runtimeConfig.session.maxAge,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  }
}

export declare type AppSession = {
  userId: string
}

export function getAppSession(event: H3Event) {
  return (event as any)[SessionKey] ?? ({
      userId: ""
    }) as AppSession
}

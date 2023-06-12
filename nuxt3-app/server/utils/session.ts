import { SessionConfig as ISessionConfig, H3Event } from "h3"

const runtimeConfig = useRuntimeConfig()

export const SessionKey = Symbol.for("SessionKey")

export const SessionConfig: ISessionConfig = {
  password: runtimeConfig.session.password,
  maxAge: runtimeConfig.session.maxAge,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  }
}

export declare type SessionData = {
  userId: string
}

export function getSessionData(event: H3Event) {
  return (event as any)[SessionKey] ?? ({
      userId: ""
    }) as SessionData
}

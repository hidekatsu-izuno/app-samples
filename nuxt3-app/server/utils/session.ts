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

import { default as postgres } from "postgres"

const runtimeConfig = useRuntimeConfig()
const sql = postgres({
  host: runtimeConfig.database.host,
  port: runtimeConfig.database.port ? Number.parseInt(runtimeConfig.database.port, 10) : 5432,
  username: runtimeConfig.database.user,
  password: runtimeConfig.database.password,
  database: runtimeConfig.database.database,
  debug: process.env.NODE_ENV === "development",
})

declare module "h3" {
  interface H3EventContext {
    database: typeof sql
  }
}

export default defineEventHandler((event) => {
  const path = getRequestPath(event)
  if (/^\/api\//.test(path)) {
    event.context.database = sql
  }
})

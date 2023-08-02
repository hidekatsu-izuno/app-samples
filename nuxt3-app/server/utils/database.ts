import { default as postgres } from "postgres"

const runtimeConfig = useRuntimeConfig()
export const sql = postgres({
  host: runtimeConfig.database.host,
  port: runtimeConfig.database.port ? Number.parseInt(runtimeConfig.database.port, 10) : 5432,
  username: runtimeConfig.database.user,
  password: runtimeConfig.database.password,
  database: runtimeConfig.database.database,
  debug: process.env.NODE_ENV === "development"
})

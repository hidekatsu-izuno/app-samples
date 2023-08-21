import { default as postgres } from "postgres"
import { logger } from "./01_logger"

const runtimeConfig = useRuntimeConfig()
export const sql = postgres({
  host: runtimeConfig.database.host,
  port: runtimeConfig.database.port ? Number.parseInt(runtimeConfig.database.port, 10) : 5432,
  username: runtimeConfig.database.user,
  password: runtimeConfig.database.password,
  database: runtimeConfig.database.database,
  debug: (connection: number, query: string, parameters: any[], paramTypes: any[]) => {
    logger.debug({ connection, query, parameters, paramTypes }, "sql")
  },
  types: {
    bigint: {
      to: 20,
      from: [20],
      parse: (x: any) => Number.parseInt(x, 10),
      serialize: (x: any) => x.toString(),
    },
  },
  transform: postgres.camel,
})

declare module "h3" {
  interface H3EventContext {
    sql: typeof sql
  }
}

export default defineEventHandler((event) => {
  event.context.sql = sql
})

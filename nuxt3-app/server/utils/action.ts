import { H3Event, H3Error, EventHandler } from "h3"
import { ZodError } from "zod"
import { default as postgres } from "postgres"

const runtimeConfig = useRuntimeConfig()
const sql = postgres({
  host: runtimeConfig.database.host,
  port: runtimeConfig.database.port ? Number.parseInt(runtimeConfig.database.port, 10) : 5432,
  username: runtimeConfig.database.user,
  password: runtimeConfig.database.password,
  database: runtimeConfig.database.database,
  debug: process.env.NODE_ENV === "development",
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

const SqlKey = Symbol.for("SqlKey")

export declare type SqlConnection = typeof sql

export function defineAction<T = any>(handler: EventHandler<T>) {
  return defineEventHandler<T>(async (event) => {
    (event as any)[SqlKey] = [sql]
    try {
      return await tx(event, async () => {
        return await handler(event)
      }, "READ ONLY")
    } catch (err) {
      if (err instanceof H3Error) {
        event.context.cause = (err.cause || err) as Error
        throw err
      } else if (err instanceof ZodError) {
        event.context.cause = err
        throw createError({ statusCode: 400, cause: err })
      } else {
        event.context.cause = err as Error
        throw createError({ statusCode: 500, cause: err })
      }
    } finally {
      delete (event as any)[SqlKey]
    }
  })
}

export async function tx<T>(event: H3Event, handler: () => T, options?: string) {
  const cSql = useSqlConnection(event)
  return await cSql.begin(options ?? "READ WRITE", async (tSql: SqlConnection) => {
    (event as any)[SqlKey].push(tSql)
    try {
      return await handler()
    } finally {
      (event as any)[SqlKey].pop(tSql)
    }
  })
}

export function useSqlConnection(event: H3Event) {
  const array = (event as any)[SqlKey]
  const cSql = array[array.length - 1]
  if (!cSql) {
    throw new Error("Cannot establish connection.")
  }
  return cSql as typeof sql
}

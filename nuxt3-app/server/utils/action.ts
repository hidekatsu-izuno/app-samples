import type { H3Event, EventHandler } from "h3"
import { ZodError } from "zod"

const SqlKey = Symbol.for("SqlKey")

export declare type ControllerOptions = {
}

export declare type SqlConnection = typeof sql

export function defineAction<T = any>(handler: EventHandler<T>): EventHandler<T>;
export function defineAction<T = any>(options: ControllerOptions, handler: EventHandler<T>): EventHandler<T>;
export function defineAction<T = any>(arg1: ControllerOptions | EventHandler<T>, arg2?: EventHandler<T>): EventHandler<T> {
  const handler = arg2 ?? (arg1 as EventHandler)
  // const options = arg2 ? arg1 as ControllerOptions : {}

  return defineEventHandler<T>(async (event) => {
    (event as any)[SqlKey] = new Array<typeof sql>()
    try {
      return await sql.begin("READ ONLY", async (sql: SqlConnection) => {
        (event as any)[SqlKey].push(sql)
        try {
          return await handler(event)
        } finally {
          (event as any)[SqlKey].pop(sql)
        }
      })
    } catch (err) {
      let newErr = err
      if (err instanceof ZodError) {
        newErr = createError({ statusCode: 400, cause: err })
      }
      throw newErr
    }
  })
}

export function useSqlConnection(event: H3Event) {
  const array = (event as any)[SqlKey] ?? [sql]

  return array[array.length - 1] as SqlConnection
}

export async function tx<T>(event: H3Event, handler: () => T) {
  const cSql = ((event as any)[SqlKey] ?? event.context.database) as SqlConnection | undefined
  if (!cSql) {
    throw new Error("Cannot establish connection.")
  }

  return await cSql.begin("READ WRITE", async (tSql: SqlConnection) => {
    (event as any)[SqlKey].push(tSql)
    try {
      return await handler()
    } finally {
      (event as any)[SqlKey].pop(tSql)
    }
  })
}

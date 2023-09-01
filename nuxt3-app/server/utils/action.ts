import type { H3Event } from "h3"
import { H3Error } from "h3"
import { ZodError } from "zod"
import type { TransactionSql } from "postgres"
import { default as postgres } from "postgres"
import { BusinessError } from "~/utils/errors"

const SqlKey = Symbol.for("SqlKey")

export declare type Sql = TransactionSql

export function defineAction(handler: Parameters<typeof defineEventHandler>[0]) {
  return defineEventHandler(async (event) => {
    (event as any)[SqlKey] = [event.context.sql]
    try {
      return await doTransaction(event, async () => {
        return await handler(event)
      }, "READ ONLY")
    } catch (err) {
      if (err instanceof postgres.PostgresError && /^23/.test(err.code)) {
        err = new BusinessError("データが重複しています", { cause: err })
      }

      if (err instanceof BusinessError) {
        const host = getRequestHost(event)
        const protocol = getRequestProtocol(event)

        event.context.cause = err
        setResponseStatus(event, 400)
        defaultContentType(event, "application/problem+json")
        return {
          type: new URL("/business-error", `${protocol}://${host}`).toString(),
          title: err.message,
        }
      } else if (err instanceof H3Error) {
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

export async function doTransaction<T>(event: H3Event, handler: () => T, options?: string) {
  const stack = (event as any)[SqlKey]
  return await stack[0].begin(options ?? "READ WRITE", async (tSql: TransactionSql) => {
    stack.push(tSql)
    try {
      return await handler()
    } finally {
      stack.pop()
    }
  })
}

export function useSqlConnection(event: H3Event) {
  const array = (event as any)[SqlKey]
  const cSql = array[array.length - 1]
  if (!cSql) {
    throw new Error("Cannot establish connection.")
  }
  return cSql as TransactionSql
}

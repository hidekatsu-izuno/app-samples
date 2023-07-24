import type { EventHandler, H3Event } from "h3"
import * as postgres from 'postgres'

export const SqlTransactionKey = Symbol.for("SqlTransactionKey")

const runtimeConfig = useRuntimeConfig()
const pg = postgres({
  host: runtimeConfig.database.host,
  port: runtimeConfig.database.port ? Number.parseInt(runtimeConfig.database.port, 10) : 5432,
  username: runtimeConfig.database.user,
  password: runtimeConfig.database.password,
  database: runtimeConfig.database.database,
})

export declare type SqlConnection = postgres.Sql

export function withSqlTransaction(handler: EventHandler) {
  return async (event: H3Event) => {
    try {
      return await pg.begin(async (sql) => {
        (event as any)[SqlTransactionKey] = sql
        try {
          return await handler(event)
        } finally {
          delete (event as any)[SqlTransactionKey]
        }
      })
    } finally {
      await pg.end()
    }
  }
}

export function useSqlConnection(event: H3Event) {
  const sql = (event as any)[SqlTransactionKey]
  if (!sql) {
    throw new Error("transaction is not started")
  }
  return sql as SqlConnection
}

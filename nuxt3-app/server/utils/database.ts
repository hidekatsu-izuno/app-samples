import { H3Event } from "h3"
import { Kysely, PostgresDialect } from "kysely"
import pg from "pg"

const config = useRuntimeConfig()

export const pgPool = new pg.Pool({
  host: config.database.host,
  port: config.database.port ? Number.parseInt(config.database.port, 10) : 5321,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
})

export async function usePgClient(event: H3Event) {
  const client = await pgPool.connect()
  event.node.res.on("error", () => {
    client.release()
  })
  event.node.res.on("finish", () => {
    client.release()
  })

  return client
}

import type { H3Event, EventHandler } from "h3"
import { ZodError } from "zod"
import { sql } from "./database"
import { AppSessionConfig } from "./session"

const AppSessionKey = Symbol.for("AppSessionKey")
const SqlKey = Symbol.for("SqlKey")

export declare type ControllerOptions = {
  session?: boolean,
  transaction?: boolean,
  get?: EventHandler,
  post?: EventHandler,
}

export function defineController(params: ControllerOptions) {
  return defineEventHandler(async (event) => {
    const method = getMethod(event)
    let handler = (params as any)[method.toLowerCase()] as EventHandler | undefined
    if (!handler) {
      throw createError({ statusCode: 400 })
    }

    if (params.session !== false) {
      const path = getRequestPath(event)
      if (!/^\/api\/auth\/.*/.test(path)) {
        const session = await useSession<AppSession>(event, AppSessionConfig)
        if (session.data?.userId) {
          (event as any)[AppSessionKey] = session.data
        } else {
          throw createError({ statusCode: 401 })
        }
      }
    }

    try {
      try {
        if (params.transaction !== false) {
          return await sql.begin(async (sql) => {
            (event as any)[SqlKey] = sql
            try {
              return handler ? await handler(event) : () => {}
            } finally {
              delete (event as any)[SqlKey]
            }
          })
        } else {
          return await handler(event)
        }
      } finally {
        await sql.end()
      }
    } catch (err) {
      if (err instanceof ZodError) {
        err = createError({ statusCode: 400, cause: err })
      }
      console.error(err)
      return err
    }
  })
}

export declare type AppSession = {
  userId: string
}

export declare type SqlConnection = typeof sql

export function getAppSession(event: H3Event) {
  return (event as any)[AppSessionKey] ?? ({
      userId: ""
    }) as AppSession
}

export function useSqlConnection(event: H3Event) {
  return ((event as any)[SqlKey] ?? sql) as SqlConnection
}

import type { H3Event, EventHandler } from "h3"
import { ZodError } from "zod"
import { sql } from "./database"
import { AppSessionConfig } from "./session"

const AppSessionKey = Symbol.for("AppSessionKey")
const SqlKey = Symbol.for("SqlKey")

export declare type ControllerOptions = {
  session?: boolean,
  transaction?: boolean,
}

export declare type AppSession = {
  userId: string
}

export declare type SqlConnection = typeof sql

export function defineAction(handler: EventHandler): EventHandler;
export function defineAction(options: ControllerOptions, handler: EventHandler): EventHandler;
export function defineAction(arg1: ControllerOptions | EventHandler, arg2?: EventHandler): EventHandler {
  const handler = arg2 ?? (arg1 as EventHandler)
  const options = arg2 ? arg1 as ControllerOptions : {}

  return defineEventHandler(async (event) => {
    const method = getMethod(event)
    if (method !== "GET" && method !== "POST") {
      throw createError({ statusCode: 400 })
    }

    if (options.session !== false) {
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
      if (options.transaction !== false) {
        return await sql.begin(async (sql) => {
          (event as any)[SqlKey] = sql
          try {
            return await handler(event)
          } finally {
            delete (event as any)[SqlKey]
          }
        })
      } else {
        return await handler(event)
      }
    } catch (err) {
      let newErr = err
      if (err instanceof ZodError) {
        newErr = createError({ statusCode: 400, cause: err })
      }
      console.error(newErr)
      return newErr
    }
  })
}

export function loggedMethod<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  const methodName = String(context.name)

  function replacementMethod(this: This, ...args: Args): Return {
    console.log(`LOG: Entering method '${methodName}'.`)
    const result = target.call(this, ...args)
    console.log(`LOG: Exiting method '${methodName}'.`)
    return result
  }

  return replacementMethod
}

export function getAppSession(event: H3Event) {
  return (event as any)[AppSessionKey] ?? ({
    userId: ""
  }) as AppSession
}

export function useSqlConnection(event: H3Event) {
  return ((event as any)[SqlKey] ?? sql) as SqlConnection
}

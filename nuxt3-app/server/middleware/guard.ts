import { defineExpressHandler, getH3Event } from "h3-express"
import express from "express"
import session from "express-session"
import pgSession from "connect-pg-simple"
import { useSessionUser } from "../utils/session"
import { pgPool } from "../utils/database"

export const PG_POOL_KEY = Symbol.for("PG_POOL_KEY")

const pgSessionStore = pgSession(session)

export default defineExpressHandler(express.Router()
  .use(session({
    store: new pgSessionStore({
      pool : pgPool,
      tableName : 'tt_session',
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }))
  .use((req, res, next) => {
    const event = getH3Event(req)
    if (/^\/v[0-9]+\//.test(event.path || '')) {
      const session = useSessionUser(event)
      if (!session.userId) {
        throw createError({ statusCode: 401 })
      }
    }
    next()
  })
  .use((req, res, next) => {
    const context = getH3Event(req).context as any
    context[PG_POOL_KEY] = PG_POOL_KEY
  })
)


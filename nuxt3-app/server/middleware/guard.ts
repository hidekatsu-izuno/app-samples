import { defineExpressHandler, getH3Event } from "h3-express"
import express from "express"
import session from "express-session"
import pg from "pg"
import pgSession from "connect-pg-simple"
import useSessionUser from "../utils/session"

const config = useRuntimeConfig()

const pgPool = new pg.Pool({
  host: config.database.host,
  port: config.database.port ? Number.parseInt(config.database.port, 10) : 5321,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
})

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
    if (/^\/v1\//.test(event.path || '')) {
      const session = useSessionUser(event)
      if (!session.userId) {
        throw createError({ statusCode: 401 })
      }
    }
    next()
  })
)

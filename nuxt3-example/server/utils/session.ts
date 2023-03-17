import type { H3Event } from "h3"
import type { Request } from "express"

const SESSION_MANAGER_KEY = Symbol.for("SESSION_MANAGER_KEY")

export default function useSessionUser(event: H3Event) {
  const context = event.context as any

  let sessionManager = context[SESSION_MANAGER_KEY]
  if (!sessionManager) {
    sessionManager = new SessionUser(event.node.req as Request)
    context[SESSION_MANAGER_KEY] = sessionManager
  }

  return sessionManager as SessionUser
}

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export class SessionUser {
  constructor(
    private req: Request
  ) {
  }

  set userId(value: string | undefined) {
    this.req.session.userId = value
  }

  get userId() {
    return this.req.session.userId
  }
}

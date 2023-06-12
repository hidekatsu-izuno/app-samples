import type { EventHandler } from "h3"

export default async function defineAppHandler(handler: EventHandler) {
  return defineEventHandler(async (event) => {
    try {
      const response = await handler(event)
      return response
    } catch (err) {
      return err
    }
  })
}

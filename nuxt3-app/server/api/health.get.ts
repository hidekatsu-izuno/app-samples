export default defineAction({
  session: false,
  transaction: false,
}, async (event) => {
  event.context.logger.info("info!")
  event.context.logger.warn("warn!")
  throw new Error("error!")
})

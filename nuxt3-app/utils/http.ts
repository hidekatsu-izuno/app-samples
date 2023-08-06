export const fetchData = $fetch.create({
  async onRequestError({ error }) {
    const err = error as any
    if (isNuxtError(err)) {
      err.fatal = true
      throw err
    } else {
      throw createError({
        statusCode: err.statusCode,
        statusMessage: err.statusMessage,
        fatal: true,
      })
    }
  }
})

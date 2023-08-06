export {
  parseDate,
  formatNumber,
  parseNumber,
  formatDate,
  toHalfwidthAscii,
  CsvReader,
  CsvWriter,
  FixlenReader,
  FixlenWriter,
} from "jtc-utils"

export { default as range } from "lodash-es/range"

export const fetchURL = $fetch.create({
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
        cause: err,
      })
    }
  },

  async onResponseError({ response }) {
    throw createError({
      statusCode: response.status,
      statusMessage: response.statusText,
      fatal: true,
    })
  },
})

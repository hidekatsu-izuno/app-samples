export {
  parseDate,
  formatNumber,
  parseNumber,
  formatDate,
  isTelephoneNo,
  toHalfwidthAscii,
  CsvReader,
  CsvWriter,
  FixlenReader,
  FixlenWriter,
} from "jtc-utils"

export { range } from "lodash-es"

export const wait = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const fetchURL = $fetch.create({
  onRequestError({ error }) {
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

  onResponseError({ response }) {
    if (response && response.headers.get("content-type") === "application/problem+json") {
      const { title, ...rest } = response._data || {}
      throw new BusinessError(title || "", rest)
    } else {
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText,
        fatal: true,
      })
    }
  },
})

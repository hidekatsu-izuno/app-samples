export const HTTPClient = {
  async get<T=any>(url: string, data?: Record<string, string>) {
    if (data) {
      url += "?" + new URLSearchParams(data)
    }
    return await fetchData<T>("GET", url)
  },
  async post<T=any>(url: string, data?: Record<string, any>) {
    return await fetchData<T>("POST", url, data)
  },
}

async function fetchData<T=any>(method: "GET" | "POST", url: string, data?: Record<string, any>) {
  try {
    return await $fetch<T>(url, {
      method,
      body: data,
    })
  } catch (err: any) {
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
}

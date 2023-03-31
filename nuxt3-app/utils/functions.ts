import {
  parse as _parseDate,
  format as _formatDate,
  parseISO,
  isValid,
  startOfToday,
} from "date-fns"
import Decimal from "decimal.js"

export function today() {
  return startOfToday()
}

export function parseDate(str: string | null | undefined, format?: string) {
  if (!str) {
    return null
  }

  try {
    const tmp = format ? _parseDate(str, format, new Date()) : parseISO(str)
    if (isValid(tmp)) {
      return tmp
    } else {
      return null
    }
  } catch (err) {
    if (err instanceof RangeError) {
      return null
    } else {
      throw err
    }
  }
}

export function formatDate(date: number | Date | string | null | undefined, format: string) {
  if (!date) {
    return ""
  } else if (typeof date === "string") {
    try {
      const tmp = parseISO(date)
      if (isValid(tmp)) {
        date = tmp
      } else {
        return date as string
      }
    } catch (err) {
      return date as string
    }
  }

  try {
    return _formatDate(date, format)
  } catch (err) {
    if (err instanceof RangeError) {
      return date.toString()
    } else {
      throw err
    }
  }
}

const ReDecimalFormat = /^((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*)(?:;((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*))?(?:;((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*))?$/
const ReDecimalText = /("(""|[^"])*"|'(''|[^'])*')/g

declare type DecimalFormatPattern = {
  prefix: string,
  suffix: string,
  groupingDigits: number,
  formatter: Intl.NumberFormat,
}

class DecimalFormat {
  constructor(
    public positive: DecimalFormatPattern,
    public negative: DecimalFormatPattern,
    public zero: DecimalFormatPattern
  ) {
  }

  format(value: number) {
    if (Number.isNaN(value)) {
      return ""
    }

    const format = value === 0 ? this.zero : (value < 0) ? this.negative: this.positive
    let formatted = Number.isFinite(value) ? format.formatter.format(Math.abs(value)) : Math.abs(value).toString()
    if (format.groupingDigits > 0) {
      const re = new RegExp("\\B(?=(\\d{" + format.groupingDigits + "})+(?!\\d))", "g")
      const sep = formatted.indexOf(".")
      formatted = formatted.substring(0, sep).replace(re, ",") + ((sep !== -1) ? formatted.substring(sep) : "")
    }
    return format.prefix + formatted + format.suffix
  }
}

const decimalFormatCache = new Map<string, DecimalFormat>()

function getDecimalFormat(format: string, locale: string = "en-US") {
  const cached = decimalFormatCache.get(format)
  if (cached) {
    return cached
  }

  const m = ReDecimalFormat.exec(format)
  if (!m || !m[2]) {
    throw new TypeError("Invalid format: " + format)
  }

  const patterns = new Array<DecimalFormatPattern>()
  for (let i = 0; i < 3; i++) {
    let iFormat = m[i * 4 + 2] || ''
    let fFormat = m[i * 4 + 3] || ''
    if (!iFormat) {
      break
    }

    let prefix = (m[i * 4 + 1] || '').replace(ReDecimalText, m => {
      const sep = m.charAt(0)
      return m.substring(1, m.length - 1).replaceAll(sep + sep, sep)
    })
    let suffix = (m[i * 4 + 4] || '').replace(ReDecimalText, m => {
      const sep = m.charAt(0)
      return m.substring(1, m.length - 1).replaceAll(sep + sep, sep)
    })

    let minimumIntegerDigits = 1
    let minimumFractionDigits = 0
    let maximumFractionDigits = 0
    let groupingDigits = 0

    if (fFormat) {
      if (fFormat.length > 1) {
        maximumFractionDigits = fFormat.length - 1
        const zeroPos = fFormat.lastIndexOf("0")
        minimumFractionDigits = ((zeroPos !== -1) ? zeroPos : 0)
      } else {
        suffix = fFormat + suffix
      }
    }

    const groupingPos = iFormat.lastIndexOf(",")
    if (groupingPos !== -1) {
      iFormat = iFormat.replaceAll(",", "")
      groupingDigits = iFormat.length - groupingPos
    }

    const zeroPos = iFormat.indexOf("0")
    if (zeroPos !== -1) {
      minimumIntegerDigits = Math.max(iFormat.length - zeroPos, 1)
    }

    patterns.push({
      prefix,
      suffix,
      groupingDigits: groupingDigits !== 3 ? groupingDigits : 0,
      formatter: new Intl.NumberFormat(locale, {
        minimumIntegerDigits,
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping: groupingDigits === 3
      }),
    })
  }

  const positive = patterns[0]
  const negative = patterns[1] || {
    ...patterns[0],
    prefix: patterns[0].prefix + "-"
  }
  const zero = patterns[2] || patterns[0]

  const dformat = new DecimalFormat(positive, negative, zero)
  decimalFormatCache.set(format, dformat)
  return dformat
}

export function parseNumber(str: string | null | undefined) {
  if (!str) {
    return null
  }

  const num = Number.parseFloat(str.replaceAll(",", ""))
  if (Number.isFinite(num)) {
    return num
  } else {
    return null
  }
}

export function formatNumber(num: string | number | null | undefined, format?: string) {
  if (num == null) {
    return ""
  } else if (typeof num === "string") {
    const tmp = parseNumber(num)
    if (tmp) {
      num = tmp as number
    } else {
      return num
    }
  }

  if (!format || !Number.isFinite(num)) {
    return toPlainString(num)
  }

  return getDecimalFormat(format).format(num)
}

export function toPlainString(num: number | string) {
  if (typeof num === "number" && (!Number.isFinite(num) || num === 0)) {
    return num.toString()
  }

  let str = num.toString()
  const sep = str.indexOf("e")
  if (sep === -1) {
    return str
  }

  let minus = ""
  if (str.startsWith("-")) {
    str = str.substring(1)
    minus = "-"
  }

  let esign = str.charAt(sep + 1)

  const e = Number.parseInt(str.substring(sep + 2), 10)
  str = str.substring(0, sep)

  const index = str.indexOf(".")
  let scale = (index === -1) ? 0 : str.length - index - 1
  str = (index === -1) ? str : (str.substring(0, index) + str.substring(index + 1))
  if (esign === "+") {
    str = str + "0".repeat(e)
  } else {
    scale = scale + e
  }

  str = str.replace(/^0+/, "")
  if (scale === 0) {
    return minus + str
  }

  const ipart = (str.length > scale) ? minus + str.substring(0, str.length - scale) : "0"
  const fpart = ((str.length > scale) ? str.substring(str.length - scale) : ("0".repeat(scale - str.length) + str)).replace(/0+$/, "")
  return  ipart + (fpart ? ("." + fpart) : "")
}

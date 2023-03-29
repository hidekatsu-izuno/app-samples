import {
  parse as _parseDate,
  format as _formatDate,
  parseISO,
} from "date-fns"
import Decimal from "decimal.js"

export function parseDate(str: string, format: string) {
  try {
    return _parseDate(str, format, new Date())
  } catch (err) {
    if (err instanceof RangeError) {
      return null
    } else {
      throw err
    }
  }
}

export function formatDate(date: number | Date | string, format: string) {
  const tmp = typeof date === "string" ? parseISO(date) : date
  if (!tmp) {
    return null
  }

  try {
    return _formatDate(tmp, format)
  } catch (err) {
    if (err instanceof RangeError) {
      return null
    } else {
      throw err
    }
  }
}

export function parseDecimal(str: string | number | null | undefined) {
  let dec
  if (!str) {
    return null
  } else  if (typeof str === "number") {
    dec = new Decimal(str)
  } else {
    try {
      dec = new Decimal(str.replaceAll(",", ""))
    } catch (err) {
      return null
    }
  }

  if (!dec.isFinite()) {
    return null
  }

  return dec
}

const ReDecimalFormat = /^((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*)(?:;((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*))?(?:;((?:"[^"]*"|'[^']*'|[^"'#0,.])*)([#,]*[0,]*)([.]0*#*)?((?:"[^"]*"|'[^']*'|[^"'#0])*))?$/
const ReDecimalText = /("(""|[^"])*"|'(''|[^'])*')/g

export function formatDecimal(dec: Decimal | string | number | null | undefined, format: string) {
  if (!(dec instanceof Decimal)) {
    dec = parseDecimal(dec)
    if (!dec) {
      return null
    }
  }

  const m = ReDecimalFormat.exec(format)
  if (!m || (!m[2] && !m[6] && !m[10])) {
    throw new TypeError("Invalid format: " + format)
  }

  let start = 0
  if (dec.isZero()) {
    dec = dec.abs()
    if (m[10]) {
      start = 8
    }
  } else if (dec.isNeg()) {
    dec = dec.abs()
    if (m[6]) {
      start = 4
    } else {
      m[1] = (m[1] || '') + "-"
    }
  }

  const prefix = (m[start + 1] || '').replace(ReDecimalText, m => {
    const sep = m.charAt(0)
    return m.substring(1, m.length - 1).replaceAll(sep + sep, sep)
  })
  const iFormat = m[start + 2] || ''
  const fFormat = m[start + 3] || ''
  const suffix = (m[start + 4] || '').replace(ReDecimalText, m => {
    const sep = m.charAt(0)
    return m.substring(1, m.length - 1).replaceAll(sep + sep, sep)
  })

  if (!dec.e && dec.e !== 0) {
    return prefix + dec.abs().toString() + suffix   // Infinity/NaN
  }

  let ipart = ""
  let fpart = ""
  if (fFormat) {
    const precision = dec.precision()
    const scale = dec.isInt() ? 0 : precision - dec.truncated().precision()
    let str
    if (fFormat.length > 1) {
      const fullSpan = fFormat.length - 1
      const zeroPos = fFormat.lastIndexOf("0")
      const zeroSpan = ((zeroPos !== -1) ? zeroPos : 0)
      str = dec.toFixed(Math.max(Math.min(scale, fullSpan), zeroSpan), Decimal.ROUND_HALF_UP)
    } else {
      str = dec.toFixed(scale)
    }
    const parts = str.split(".")
    ipart = parts[0] || ''
    fpart = '.' + (parts[1] || '')
  } else {
    ipart = dec.toFixed(0, Decimal.ROUND_HALF_UP)
  }

  const commaPos = iFormat.lastIndexOf(",")
  if (commaPos !== -1) {
    const iFormatNoComma = iFormat.replaceAll(",", "")
    const zeroPos = iFormatNoComma.indexOf("0")
    const zeroSpan = (zeroPos !== -1) ? iFormatNoComma.length - zeroPos : 0
    if (ipart.length < zeroSpan) {
      ipart = "0".repeat(zeroSpan - ipart.length) + ipart
    }

    const commaSpan = iFormat.length - commaPos -1
    if (commaSpan > 0) {
      ipart = ipart.replace(new RegExp("\\B(?=(\\d{" + commaSpan + "})+(?!\\d))", "g"), ",")
    }
  } else {
    const zeroPos = iFormat.indexOf("0")
    const zeroSpan = (zeroPos !== -1) ? iFormat.length - zeroPos : 0
    if (ipart.length < zeroSpan) {
      ipart = "0".repeat(zeroSpan - ipart.length) + ipart
    }
  }

  return prefix + ipart + fpart + suffix
}

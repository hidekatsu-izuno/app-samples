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
      return undefined
    } else {
      throw err
    }
  }
}

export function formatDate(date: number | Date | string, format: string) {
  const tmp = typeof date === "string" ? parseISO(date) : date
  if (!tmp) {
    return undefined
  }

  try {
    return _formatDate(tmp, format)
  } catch (err) {
    if (err instanceof RangeError) {
      return undefined
    } else {
      throw err
    }
  }
}

export function parseDecimal(str: string) {
  try {
    return new Decimal(str.replaceAll(",", "_"))
  } catch (err) {
    return undefined
  }
}

const ReDecimalFormat = /^((?:'[^']*'|[^'])*)([#,]*[0,]*)([.]0*#*)?((?:'[^']*'|[^'])*)$/
const ReDecimalText = /'[^']*'/g

export function formatDecimal(dec: Decimal, format: string) {
  const formats = format.split(';')
  const fmt =  (dec.s > 0) ? formats[0]
    : (dec.s < 0) ? formats[1] || '-' + formats[0]
    : formats[2] || formats[0]

  const m = ReDecimalFormat.exec(fmt)
  if (!m) {
    throw new TypeError("Invalid format: " + fmt)
  }
  const prefix = (m[0] || '').replace(ReDecimalText, m => m === "''" ? "'" : m.substring(1, m.length - 1))
  const ipartF = m[1] || ''
  const fpartF = m[2] || ''
  const suffix = (m[3] || '').replace(ReDecimalText, m => m === "''" ? "'" : m.substring(1, m.length - 1))

  if (!dec.e && dec.e !== 0) {
    return prefix + dec.abs().toString() + suffix   // Infinity/NaN
  }

  let ipart = ""
  let fpart = ""
  if (fpartF) {
    if (fpartF.length > 1) {
      const parts = dec.toFixed(fpartF.length - 1, Decimal.ROUND_HALF_UP).split(".")
      ipart = parts[0] || ''
      fpart = parts[1] || ''
      const minScale = Math.max(fpartF.lastIndexOf("0"), 1) - 1
      if (fpart.length < minScale) {
        fpart = fpart + "0".repeat(minScale - fpart.length)
      }
    } else {
      const parts = dec.toFixed(Number.MAX_SAFE_INTEGER, Decimal.ROUND_HALF_UP).split(".")
      ipart = parts[0] || ''
      fpart = parts[1] || ''
    }
  } else {
    ipart = dec.toFixed(0, Decimal.ROUND_HALF_UP)
  }

  const commaPos = ipartF.lastIndexOf(",")
  if (commaPos !== -1) {
    const ipartFNoComma = ipartF.replaceAll(",", "")
    const zeroPos = ipartFNoComma.indexOf("0")
    const zeroSpan = (zeroPos === -1) ? 0 : ipartF.length - zeroPos
    if (ipart.length < zeroSpan) {
      ipart = "0".repeat(zeroSpan - ipart.length) + ipart
    }

    const commaSpan = ipartF.length - commaPos
    ipart = ipart.replace(new RegExp("\\B(?=(\\d{" + commaSpan + "})+(?!\\d))", "g"), ",")
  }

  return fpart ? ipart + "." + fpart : ipart
}

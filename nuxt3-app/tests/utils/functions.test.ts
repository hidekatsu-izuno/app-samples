import { describe, expect, test } from "vitest"
import { formatNumber, parseNumber, toPlainString } from "../../utils/functions"

describe('test formatNumber', () => {
  test('format zero', () => {
    expect(formatNumber(parseNumber("0"), "#")).toBe("0")
    expect(formatNumber(parseNumber("+0"), "#")).toBe("0")
    expect(formatNumber(parseNumber("-0"), "#")).toBe("0")

    expect(formatNumber(parseNumber("0"), "000")).toBe("000")
    expect(formatNumber(parseNumber("+0"), "000")).toBe("000")
    expect(formatNumber(parseNumber("-0"), "000")).toBe("000")

    expect(formatNumber(parseNumber("0"), "##0,000")).toBe("0,000")
    expect(formatNumber(parseNumber("+0"), "##0,000")).toBe("0,000")
    expect(formatNumber(parseNumber("-0"), "##0,000")).toBe("0,000")

    expect(formatNumber(parseNumber("0"), "#.")).toBe("0.")
    expect(formatNumber(parseNumber("+0"), "#.")).toBe("0.")
    expect(formatNumber(parseNumber("-0"), "#.")).toBe("0.")

    expect(formatNumber(parseNumber("0"), "#.#")).toBe("0")
    expect(formatNumber(parseNumber("+0"), "#.#")).toBe("0")
    expect(formatNumber(parseNumber("-0"), "#.#")).toBe("0")

    expect(formatNumber(parseNumber("0"), "#.0")).toBe("0.0")
    expect(formatNumber(parseNumber("+0"), "#.0")).toBe("0.0")
    expect(formatNumber(parseNumber("-0"), "#.0")).toBe("0.0")

    expect(formatNumber(parseNumber("0"), "#.0#")).toBe("0.0")
    expect(formatNumber(parseNumber("+0"), "#.0#")).toBe("0.0")
    expect(formatNumber(parseNumber("-0"), "#.0#")).toBe("0.0")

    expect(formatNumber(parseNumber("0"), "#.00")).toBe("0.00")
    expect(formatNumber(parseNumber("+0"), "#.00")).toBe("0.00")
    expect(formatNumber(parseNumber("-0"), "#.00")).toBe("0.00")

    expect(formatNumber(parseNumber("0"), "#.00#")).toBe("0.00")
    expect(formatNumber(parseNumber("+0"), "#.00#")).toBe("0.00")
    expect(formatNumber(parseNumber("-0"), "#.00#")).toBe("0.00")

    expect(formatNumber(parseNumber("0"), "abc#.00#xyz")).toBe("abc0.00xyz")
    expect(formatNumber(parseNumber("+0"), "abc#.00#xyz")).toBe("abc0.00xyz")
    expect(formatNumber(parseNumber("-0"), "abc#.00#xyz")).toBe("abc0.00xyz")

    expect(formatNumber(parseNumber("0"), "a'bB'c#.00#x\"yY\"z")).toBe("abBc0.00xyYz")
    expect(formatNumber(parseNumber("+0"), "a\"bB\"c#.00#x'yY'z")).toBe("abBc0.00xyYz")
    expect(formatNumber(parseNumber("-0"), "a'b''B'c#.00#x\"y\"\"Y\"z")).toBe("ab'Bc0.00xy\"Yz")
  })

  test('format one', () => {
    expect(formatNumber(parseNumber("1"), "#")).toBe("1")
    expect(formatNumber(parseNumber("+1"), "#")).toBe("1")
    expect(formatNumber(parseNumber("-1"), "#")).toBe("-1")
    expect(formatNumber(parseNumber("1"), "000")).toBe("001")
    expect(formatNumber(parseNumber("+1"), "000")).toBe("001")
    expect(formatNumber(parseNumber("-1"), "000")).toBe("-001")
    expect(formatNumber(parseNumber("1"), "##0,000")).toBe("0,001")
    expect(formatNumber(parseNumber("+1"), "##0,000")).toBe("0,001")
    expect(formatNumber(parseNumber("-1"), "##0,000")).toBe("-0,001")

    expect(formatNumber(parseNumber("1"), "#.#")).toBe("1")
    expect(formatNumber(parseNumber("+1"), "#.#")).toBe("1")
    expect(formatNumber(parseNumber("-1"), "#.#")).toBe("-1")

    expect(formatNumber(parseNumber("1"), "#.0")).toBe("1.0")
    expect(formatNumber(parseNumber("+1"), "#.0")).toBe("1.0")
    expect(formatNumber(parseNumber("-1"), "#.0")).toBe("-1.0")

    expect(formatNumber(parseNumber("1"), "#.0#")).toBe("1.0")
    expect(formatNumber(parseNumber("+1"), "#.0#")).toBe("1.0")
    expect(formatNumber(parseNumber("-1"), "#.0#")).toBe("-1.0")

    expect(formatNumber(parseNumber("1"), "#.00")).toBe("1.00")
    expect(formatNumber(parseNumber("+1"), "#.00")).toBe("1.00")
    expect(formatNumber(parseNumber("-1"), "#.00")).toBe("-1.00")
  })

  test('format integer', () => {
    expect(formatNumber(parseNumber("10"), "#")).toBe("10")
    expect(formatNumber(parseNumber("-10"), "#")).toBe("-10")
    expect(formatNumber(parseNumber("100"), "#")).toBe("100")
    expect(formatNumber(parseNumber("-100"), "#")).toBe("-100")
    expect(formatNumber(parseNumber("1000"), "#")).toBe("1000")
    expect(formatNumber(parseNumber("-1000"), "#")).toBe("-1000")
    expect(formatNumber(parseNumber("1000.4"), "#")).toBe("1000")
    expect(formatNumber(parseNumber("1000.5"), "#")).toBe("1001")
    expect(formatNumber(parseNumber("1000.00"), "#")).toBe("1000")
    expect(formatNumber(parseNumber("1000.04"), "#")).toBe("1000")
    expect(formatNumber(parseNumber("1000.05"), "#")).toBe("1000")

    expect(formatNumber(parseNumber("1000"), "#,###")).toBe("1,000")
    expect(formatNumber(parseNumber("1000.4"), "#,###")).toBe("1,000")
    expect(formatNumber(parseNumber("1000.5"), "#,###")).toBe("1,001")
    expect(formatNumber(parseNumber("1000.00"), "#,###")).toBe("1,000")
    expect(formatNumber(parseNumber("1000.04"), "#,###")).toBe("1,000")
    expect(formatNumber(parseNumber("1000.05"), "#,###")).toBe("1,000")
    expect(formatNumber(parseNumber("1000000"), "#,###")).toBe("1,000,000")
    expect(formatNumber(parseNumber("1000000.4"), "#,###")).toBe("1,000,000")
    expect(formatNumber(parseNumber("1000000.5"), "#,###")).toBe("1,000,001")
    expect(formatNumber(parseNumber("1000000.00"), "#,###")).toBe("1,000,000")
    expect(formatNumber(parseNumber("1000000.04"), "#,###")).toBe("1,000,000")
    expect(formatNumber(parseNumber("1000000.05"), "#,###")).toBe("1,000,000")

    expect(formatNumber(parseNumber("10"), "000")).toBe("010")
    expect(formatNumber(parseNumber("-10"), "000")).toBe("-010")
    expect(formatNumber(parseNumber("100"), "000")).toBe("100")
    expect(formatNumber(parseNumber("-100"), "000")).toBe("-100")
    expect(formatNumber(parseNumber("1000"), "000")).toBe("1000")
    expect(formatNumber(parseNumber("-1000"), "000")).toBe("-1000")

    expect(formatNumber(parseNumber("10"), "##0,000")).toBe("0,010")
    expect(formatNumber(parseNumber("-10"), "##0,000")).toBe("-0,010")
    expect(formatNumber(parseNumber("100"), "##0,000")).toBe("0,100")
    expect(formatNumber(parseNumber("-100"), "##0,000")).toBe("-0,100")
    expect(formatNumber(parseNumber("1000"), "##0,000")).toBe("1,000")
    expect(formatNumber(parseNumber("-1000"), "##0,000")).toBe("-1,000")
  })
})

describe('test toPlainString', () => {
  test('format integer', () => {
    expect(toPlainString("1")).toBe("1")
    expect(toPlainString("1e+1")).toBe("10")
    expect(toPlainString("1.0e+1")).toBe("10")
    expect(toPlainString("1e-1")).toBe("0.1")
    expect(toPlainString("0.01e+1")).toBe("0.1")
    expect(toPlainString("0.1e-1")).toBe("0.01")
    expect(toPlainString("0.0e+1")).toBe("0")
    expect(toPlainString("0.0e-1")).toBe("0")
  })
})

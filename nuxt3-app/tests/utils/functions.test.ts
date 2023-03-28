import { describe, expect, test } from "vitest"
import { formatDecimal, parseDecimal } from "../../utils/functions"

describe('test formatDecimal', () => {
  test('format zero', () => {
    expect(formatDecimal(parseDecimal("0"), "#")).toBe("0")
    expect(formatDecimal(parseDecimal("+0"), "#")).toBe("0")
    expect(formatDecimal(parseDecimal("-0"), "#")).toBe("0")

    expect(formatDecimal(parseDecimal("0"), "000")).toBe("000")
    expect(formatDecimal(parseDecimal("+0"), "000")).toBe("000")
    expect(formatDecimal(parseDecimal("-0"), "000")).toBe("000")

    expect(formatDecimal(parseDecimal("0"), "##0,000")).toBe("0,000")
    expect(formatDecimal(parseDecimal("+0"), "##0,000")).toBe("0,000")
    expect(formatDecimal(parseDecimal("-0"), "##0,000")).toBe("0,000")

    expect(formatDecimal(parseDecimal("0"), "#.")).toBe("0.")
    expect(formatDecimal(parseDecimal("+0"), "#.")).toBe("0.")
    expect(formatDecimal(parseDecimal("-0"), "#.")).toBe("0.")

    expect(formatDecimal(parseDecimal("0"), "#.#")).toBe("0.")
    expect(formatDecimal(parseDecimal("+0"), "#.#")).toBe("0.")
    expect(formatDecimal(parseDecimal("-0"), "#.#")).toBe("0.")

    expect(formatDecimal(parseDecimal("0"), "#.0")).toBe("0.0")
    expect(formatDecimal(parseDecimal("+0"), "#.0")).toBe("0.0")
    expect(formatDecimal(parseDecimal("-0"), "#.0")).toBe("0.0")

    expect(formatDecimal(parseDecimal("0"), "#.0#")).toBe("0.0")
    expect(formatDecimal(parseDecimal("+0"), "#.0#")).toBe("0.0")
    expect(formatDecimal(parseDecimal("-0"), "#.0#")).toBe("0.0")

    expect(formatDecimal(parseDecimal("0"), "#.00")).toBe("0.00")
    expect(formatDecimal(parseDecimal("+0"), "#.00")).toBe("0.00")
    expect(formatDecimal(parseDecimal("-0"), "#.00")).toBe("0.00")

    expect(formatDecimal(parseDecimal("0"), "#.00#")).toBe("0.00")
    expect(formatDecimal(parseDecimal("+0"), "#.00#")).toBe("0.00")
    expect(formatDecimal(parseDecimal("-0"), "#.00#")).toBe("0.00")

    expect(formatDecimal(parseDecimal("0"), "abc#.00#xyz")).toBe("abc0.00xyz")
    expect(formatDecimal(parseDecimal("+0"), "abc#.00#xyz")).toBe("abc0.00xyz")
    expect(formatDecimal(parseDecimal("-0"), "abc#.00#xyz")).toBe("abc0.00xyz")

    expect(formatDecimal(parseDecimal("0"), "a'bB'c#.00#x\"yY\"z")).toBe("abBc0.00xyYz")
    expect(formatDecimal(parseDecimal("+0"), "a\"bB\"c#.00#x'yY'z")).toBe("abBc0.00xyYz")
    expect(formatDecimal(parseDecimal("-0"), "a'b''B'c#.00#x\"y\"\"Y\"z")).toBe("ab'Bc0.00xy\"Yz")
  })

  test('format one', () => {
    expect(formatDecimal(parseDecimal("1"), "#")).toBe("1")
    expect(formatDecimal(parseDecimal("+1"), "#")).toBe("1")
    expect(formatDecimal(parseDecimal("-1"), "#")).toBe("-1")
    expect(formatDecimal(parseDecimal("1"), "000")).toBe("001")
    expect(formatDecimal(parseDecimal("+1"), "000")).toBe("001")
    expect(formatDecimal(parseDecimal("-1"), "000")).toBe("-001")
    expect(formatDecimal(parseDecimal("1"), "##0,000")).toBe("0,001")
    expect(formatDecimal(parseDecimal("+1"), "##0,000")).toBe("0,001")
    expect(formatDecimal(parseDecimal("-1"), "##0,000")).toBe("-0,001")

    expect(formatDecimal(parseDecimal("1"), "#.#")).toBe("1.")
    expect(formatDecimal(parseDecimal("+1"), "#.#")).toBe("1.")
    expect(formatDecimal(parseDecimal("-1"), "#.#")).toBe("-1.")

    expect(formatDecimal(parseDecimal("1"), "#.0")).toBe("1.0")
    expect(formatDecimal(parseDecimal("+1"), "#.0")).toBe("1.0")
    expect(formatDecimal(parseDecimal("-1"), "#.0")).toBe("-1.0")

    expect(formatDecimal(parseDecimal("1"), "#.0#")).toBe("1.0")
    expect(formatDecimal(parseDecimal("+1"), "#.0#")).toBe("1.0")
    expect(formatDecimal(parseDecimal("-1"), "#.0#")).toBe("-1.0")

    expect(formatDecimal(parseDecimal("1"), "#.00")).toBe("1.00")
    expect(formatDecimal(parseDecimal("+1"), "#.00")).toBe("1.00")
    expect(formatDecimal(parseDecimal("-1"), "#.00")).toBe("-1.00")
  })

  test('format integer', () => {
    expect(formatDecimal(parseDecimal("10"), "#")).toBe("10")
    expect(formatDecimal(parseDecimal("-10"), "#")).toBe("-10")
    expect(formatDecimal(parseDecimal("100"), "#")).toBe("100")
    expect(formatDecimal(parseDecimal("-100"), "#")).toBe("-100")
    expect(formatDecimal(parseDecimal("1000"), "#")).toBe("1000")
    expect(formatDecimal(parseDecimal("-1000"), "#")).toBe("-1000")
    expect(formatDecimal(parseDecimal("1000.4"), "#")).toBe("1000")
    expect(formatDecimal(parseDecimal("1000.5"), "#")).toBe("1001")
    expect(formatDecimal(parseDecimal("1000.00"), "#")).toBe("1000")
    expect(formatDecimal(parseDecimal("1000.04"), "#")).toBe("1000")
    expect(formatDecimal(parseDecimal("1000.05"), "#")).toBe("1000")

    expect(formatDecimal(parseDecimal("1000"), "#,###")).toBe("1,000")
    expect(formatDecimal(parseDecimal("1000.4"), "#,###")).toBe("1,000")
    expect(formatDecimal(parseDecimal("1000.5"), "#,###")).toBe("1,001")
    expect(formatDecimal(parseDecimal("1000.00"), "#,###")).toBe("1,000")
    expect(formatDecimal(parseDecimal("1000.04"), "#,###")).toBe("1,000")
    expect(formatDecimal(parseDecimal("1000.05"), "#,###")).toBe("1,000")
    expect(formatDecimal(parseDecimal("1000000"), "#,###")).toBe("1,000,000")
    expect(formatDecimal(parseDecimal("1000000.4"), "#,###")).toBe("1,000,000")
    expect(formatDecimal(parseDecimal("1000000.5"), "#,###")).toBe("1,000,001")
    expect(formatDecimal(parseDecimal("1000000.00"), "#,###")).toBe("1,000,000")
    expect(formatDecimal(parseDecimal("1000000.04"), "#,###")).toBe("1,000,000")
    expect(formatDecimal(parseDecimal("1000000.05"), "#,###")).toBe("1,000,000")

    expect(formatDecimal(parseDecimal("10"), "000")).toBe("010")
    expect(formatDecimal(parseDecimal("-10"), "000")).toBe("-010")
    expect(formatDecimal(parseDecimal("100"), "000")).toBe("100")
    expect(formatDecimal(parseDecimal("-100"), "000")).toBe("-100")
    expect(formatDecimal(parseDecimal("1000"), "000")).toBe("1000")
    expect(formatDecimal(parseDecimal("-1000"), "000")).toBe("-1000")

    expect(formatDecimal(parseDecimal("10"), "##0,000")).toBe("0,010")
    expect(formatDecimal(parseDecimal("-10"), "##0,000")).toBe("-0,010")
    expect(formatDecimal(parseDecimal("100"), "##0,000")).toBe("0,100")
    expect(formatDecimal(parseDecimal("-100"), "##0,000")).toBe("-0,100")
    expect(formatDecimal(parseDecimal("1000"), "##0,000")).toBe("1,000")
    expect(formatDecimal(parseDecimal("-1000"), "##0,000")).toBe("-1,000")
  })
})

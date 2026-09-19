import { describe, expect, it } from "vitest"

import { VAT_RATES, type VatRate } from "../model/catalogs"
import { grossToNet, netToGross, roundMoney } from "./price"

describe("roundMoney", () => {
  it.each([
    { value: 1.234, expected: 1.23 },
    { value: 1.004, expected: 1 },
    { value: 0.125, expected: 0.13 },
    { value: 8.575, expected: 8.58 },
  ])("rounds $value to $expected", ({ value, expected }) => {
    expect(roundMoney(value)).toBe(expected)
  })

  it("rounds a half cent up even when the binary float is slightly below it", () => {
    // 1.005 is stored as 1.00499999999999989..., so a naive round gives 1.00
    expect(roundMoney(1.005)).toBe(1.01)
  })
})

describe("netToGross", () => {
  it.each<{ net: number; vat: VatRate; gross: number }>([
    { net: 100, vat: 23, gross: 123 },
    { net: 100, vat: 8, gross: 108 },
    { net: 100, vat: 5, gross: 105 },
    { net: 100, vat: 0, gross: 100 },
    { net: 99.99, vat: 23, gross: 122.99 },
    { net: 49.99, vat: 8, gross: 53.99 },
    { net: 19.99, vat: 5, gross: 20.99 },
    { net: 12.34, vat: 0, gross: 12.34 },
    // 16.5 * 1.23 and 4.3 * 1.05 land exactly on a half cent, but in binary
    // floating point they are slightly below it (16.5 * 1.23 === 20.294999…)
    { net: 16.5, vat: 23, gross: 20.3 },
    { net: 4.3, vat: 5, gross: 4.52 },
    // 49.63 * 1.23 = 61.0449, just below a half cent: a rounding fix that
    // nudges values up too far would give 61.05
    { net: 49.63, vat: 23, gross: 61.04 },
  ])(
    "adds $vat% VAT to $net net giving $gross gross, rounded to cents",
    ({ net, vat, gross }) => {
      expect(netToGross(net, vat)).toBe(gross)
    }
  )
})

describe("grossToNet", () => {
  it.each<{ gross: number; vat: VatRate; net: number }>([
    { gross: 123, vat: 23, net: 100 },
    { gross: 108, vat: 8, net: 100 },
    { gross: 105, vat: 5, net: 100 },
    { gross: 100, vat: 0, net: 100 },
    { gross: 100, vat: 23, net: 81.3 },
    { gross: 100, vat: 8, net: 92.59 },
    { gross: 100, vat: 5, net: 95.24 },
    { gross: 12.34, vat: 0, net: 12.34 },
  ])(
    "removes $vat% VAT from $gross gross giving $net net, rounded to cents",
    ({ gross, vat, net }) => {
      expect(grossToNet(gross, vat)).toBe(net)
    }
  )
})

describe("net to gross and back", () => {
  const typicalNetPrices = [0.01, 9.99, 49.9, 199, 1234.56, 4999.99]

  it.each(VAT_RATES)("returns the original net price at %i% VAT", (vat) => {
    const roundTripped = typicalNetPrices.map((net) =>
      grossToNet(netToGross(net, vat), vat)
    )
    expect(roundTripped).toEqual(typicalNetPrices)
  })
})

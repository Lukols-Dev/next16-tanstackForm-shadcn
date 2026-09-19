import { describe, expect, it } from "vitest"

import type { Currency } from "../model/catalogs"
import { formatPrice } from "./format"

describe("formatPrice", () => {
  // Intl separates the amount and the currency code with a no-break space.
  it.each<{
    scenario: string
    amount: number
    currency: Currency
    expected: string
  }>([
    {
      scenario: "uses a decimal comma and the ISO currency code",
      amount: 19.9,
      currency: "PLN",
      expected: "19,90\u00a0PLN",
    },
    {
      scenario: "does not group thousands even in five-digit amounts",
      amount: 12999,
      currency: "PLN",
      expected: "12999,00\u00a0PLN",
    },
    {
      scenario: "always shows two decimals for a zero amount",
      amount: 0,
      currency: "PLN",
      expected: "0,00\u00a0PLN",
    },
    {
      scenario: "rounds to two decimals",
      amount: 9.999,
      currency: "PLN",
      expected: "10,00\u00a0PLN",
    },
    {
      scenario: "shows the code of other currencies",
      amount: 49.99,
      currency: "EUR",
      expected: "49,99\u00a0EUR",
    },
  ])("$scenario", ({ amount, currency, expected }) => {
    expect(formatPrice(amount, currency)).toBe(expected)
  })
})

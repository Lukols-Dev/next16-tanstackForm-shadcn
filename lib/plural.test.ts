import { describe, expect, it } from "vitest"

import { plural, type PluralForms } from "./plural"

const forms: PluralForms = { one: "one", few: "few", many: "many" }

describe("plural (Polish rules)", () => {
  it("uses the singular form for exactly one", () => {
    expect(plural(1, forms)).toBe("one")
  })

  it.each([2, 3, 4, 22, 23, 24])("uses the 'few' form for %i", (n) => {
    expect(plural(n, forms)).toBe("few")
  })

  it.each([0, 5, 11, 12, 13, 14, 21, 25, 112])(
    "uses the 'many' form for %i",
    (n) => {
      expect(plural(n, forms)).toBe("many")
    }
  )
})

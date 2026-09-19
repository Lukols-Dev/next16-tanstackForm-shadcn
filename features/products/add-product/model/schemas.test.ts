import { describe, expect, it } from "vitest"
import type { ZodType } from "zod"

import { messages } from "@/messages"

import { PRODUCT_FORM_DEFAULTS, type ProductFormValues } from "./form-values"
import {
  availabilitySchema,
  createBasicsSchema,
  pricingSchema,
} from "./schemas"

const e = messages.productForm.errors

type Basics = ProductFormValues["basics"]
type Pricing = ProductFormValues["pricing"]
type Availability = ProductFormValues["availability"]

/** Field path -> message shown next to that field. */
type FieldErrors = Record<string, string>

/**
 * Maps each invalid field to its first error message, which is the one the
 * form shows next to that field. An empty object means the step is valid.
 */
function fieldErrors(schema: ZodType, input: unknown): FieldErrors {
  const result = schema.safeParse(input)
  const errors: FieldErrors = {}
  for (const issue of result.error?.issues ?? []) {
    errors[issue.path.join(".")] ??= issue.message
  }
  return errors
}

describe("basics step schema", () => {
  // ProductsView passes the SKUs of existing products upper-cased.
  const schema = createBasicsSchema(new Set(["MBP14M3PRO", "GALAXYS24"]))

  const basics = (overrides: Partial<Basics> = {}): Basics => ({
    ...PRODUCT_FORM_DEFAULTS.basics,
    name: "Dell XPS 13",
    sku: "XPS13PLUS",
    description: "Ultrabook, 16 GB RAM",
    manufacturer: "Dell",
    category: "Komputery",
    features: ["WiFI", "USB-C"],
    ...overrides,
  })

  it("accepts a fully described product", () => {
    expect(fieldErrors(schema, basics())).toEqual({})
  })

  it.each<{ case: string; input: Partial<Basics> }>([
    { case: "an empty description", input: { description: "" } },
    { case: "a name of exactly 3 characters", input: { name: "  Mi9  " } },
    { case: "a SKU of exactly 24 characters", input: { sku: "A".repeat(24) } },
    { case: "a SKU with lower-case letters", input: { sku: "xps13plus" } },
  ])("accepts $case", ({ input }) => {
    expect(fieldErrors(schema, basics(input))).toEqual({})
  })

  it("reports every mandatory field when the step is left empty", () => {
    expect(fieldErrors(schema, PRODUCT_FORM_DEFAULTS.basics)).toEqual({
      name: e.name.required,
      sku: e.sku.required,
      manufacturer: e.manufacturer.required,
      category: e.category.required,
      features: e.features.required,
    })
  })

  it.each<{ case: string; input: Partial<Basics>; expected: FieldErrors }>([
    {
      case: "a whitespace-only name as missing",
      input: { name: "   " },
      expected: { name: e.name.required },
    },
    {
      case: "a name shorter than 3 characters after trimming",
      input: { name: "  TV  " },
      expected: { name: e.name.tooShort },
    },
    {
      case: "a SKU with Polish letters",
      input: { sku: "KSIĄŻKA1" },
      expected: { sku: e.sku.pattern },
    },
    {
      case: "a SKU with a space",
      input: { sku: "MBP 14" },
      expected: { sku: e.sku.pattern },
    },
    {
      case: "a SKU with a dash",
      input: { sku: "MBP-14" },
      expected: { sku: e.sku.pattern },
    },
    {
      case: "a SKU longer than 24 characters",
      input: { sku: "A".repeat(25) },
      expected: { sku: e.sku.tooLong },
    },
  ])("rejects $case", ({ input, expected }) => {
    expect(fieldErrors(schema, basics(input))).toEqual(expected)
  })

  it.each(["MBP14M3PRO", "mbp14m3pro", "Mbp14M3Pro", "  mbp14m3pro  "])(
    "rejects SKU %j as a duplicate of an existing product regardless of case",
    (sku) => {
      expect(fieldErrors(schema, basics({ sku }))).toEqual({
        sku: e.sku.duplicate,
      })
    }
  )
})

describe("pricing step schema", () => {
  const pricing = (overrides: Partial<Pricing> = {}): Pricing => ({
    ...PRODUCT_FORM_DEFAULTS.pricing,
    priceNet: 100,
    priceGross: 123,
    ...overrides,
  })

  it("accepts positive net and gross prices", () => {
    expect(fieldErrors(pricingSchema, pricing())).toEqual({})
  })

  it("reports both prices as required when the step is left empty", () => {
    expect(fieldErrors(pricingSchema, PRODUCT_FORM_DEFAULTS.pricing)).toEqual({
      priceNet: e.priceNet.required,
      priceGross: e.priceGross.required,
    })
  })

  it.each<{ case: string; input: Partial<Pricing>; expected: FieldErrors }>([
    {
      case: "a zero net price",
      input: { priceNet: 0 },
      expected: { priceNet: e.priceNet.positive },
    },
    {
      case: "a negative net price",
      input: { priceNet: -10 },
      expected: { priceNet: e.priceNet.positive },
    },
    {
      case: "a zero gross price",
      input: { priceGross: 0 },
      expected: { priceGross: e.priceGross.positive },
    },
    {
      case: "a negative gross price",
      input: { priceGross: -0.01 },
      expected: { priceGross: e.priceGross.positive },
    },
  ])("rejects $case", ({ input, expected }) => {
    expect(fieldErrors(pricingSchema, pricing(input))).toEqual(expected)
  })
})

describe("availability step schema", () => {
  const availability = (overrides: Partial<Availability> = {}) => ({
    ...PRODUCT_FORM_DEFAULTS.availability,
    ...overrides,
  })

  it("accepts the untouched step of a product that is not limited", () => {
    expect(fieldErrors(availabilitySchema, availability())).toEqual({})
  })

  it.each([null, -1, 2.5])(
    "ignores stock quantity %j when the product is not limited",
    (stockQuantity) => {
      expect(
        fieldErrors(
          availabilitySchema,
          availability({ isLimited: false, stockQuantity })
        )
      ).toEqual({})
    }
  )

  it.each<{ case: string; input: Partial<Availability> }>([
    {
      case: "a limited product with zero items in stock",
      input: { isLimited: true, stockQuantity: 0 },
    },
    {
      case: "equal minimum and maximum per cart",
      input: { minPerCart: 5, maxPerCart: 5 },
    },
  ])("accepts $case", ({ input }) => {
    expect(fieldErrors(availabilitySchema, availability(input))).toEqual({})
  })

  it.each<{
    case: string
    input: Partial<Availability>
    expected: FieldErrors
  }>([
    {
      case: "a limited product without stock quantity",
      input: { isLimited: true, stockQuantity: null },
      expected: { stockQuantity: e.stockQuantity.required },
    },
    {
      case: "a fractional stock quantity",
      input: { isLimited: true, stockQuantity: 1.5 },
      expected: { stockQuantity: e.stockQuantity.integer },
    },
    {
      case: "a negative stock quantity",
      input: { isLimited: true, stockQuantity: -1 },
      expected: { stockQuantity: e.stockQuantity.negative },
    },
    {
      case: "a missing minimum per cart",
      input: { minPerCart: null },
      expected: { minPerCart: e.minPerCart.required },
    },
    {
      case: "a missing maximum per cart",
      input: { maxPerCart: null },
      expected: { maxPerCart: e.maxPerCart.required },
    },
    {
      case: "a minimum per cart below 1",
      input: { minPerCart: 0 },
      expected: { minPerCart: e.minPerCart.min },
    },
    {
      case: "a fractional minimum per cart",
      input: { minPerCart: 1.5 },
      expected: { minPerCart: e.minPerCart.integer },
    },
    {
      case: "a fractional maximum per cart",
      input: { maxPerCart: 2.5 },
      expected: { maxPerCart: e.maxPerCart.integer },
    },
    {
      case: "a minimum above the maximum on both cart fields",
      input: { minPerCart: 5, maxPerCart: 3 },
      expected: {
        minPerCart: e.minPerCart.tooHigh,
        maxPerCart: e.maxPerCart.tooLow,
      },
    },
  ])("rejects $case", ({ input, expected }) => {
    expect(fieldErrors(availabilitySchema, availability(input))).toEqual(
      expected
    )
  })

  it.each<{
    case: string
    input: Partial<Availability>
    expected: FieldErrors
  }>([
    {
      case: "a missing stock quantity together with min above max",
      input: {
        isLimited: true,
        stockQuantity: null,
        minPerCart: 5,
        maxPerCart: 3,
      },
      expected: {
        stockQuantity: e.stockQuantity.required,
        minPerCart: e.minPerCart.tooHigh,
        maxPerCart: e.maxPerCart.tooLow,
      },
    },
    {
      case: "a missing stock quantity while the minimum per cart is empty",
      input: { isLimited: true, stockQuantity: null, minPerCart: null },
      expected: {
        stockQuantity: e.stockQuantity.required,
        minPerCart: e.minPerCart.required,
      },
    },
    {
      case: "a negative stock quantity while the maximum per cart is empty",
      input: { isLimited: true, stockQuantity: -1, maxPerCart: null },
      expected: {
        stockQuantity: e.stockQuantity.negative,
        maxPerCart: e.maxPerCart.required,
      },
    },
  ])("reports all problems at once for $case", ({ input, expected }) => {
    expect(fieldErrors(availabilitySchema, availability(input))).toEqual(
      expected
    )
  })
})

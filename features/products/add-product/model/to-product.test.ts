import { describe, expect, it } from "vitest"
import { ZodError } from "zod"

import { PRODUCT_FORM_DEFAULTS, type ProductFormValues } from "./form-values"
import { toProduct } from "./to-product"

type FormOverrides = {
  [Step in keyof ProductFormValues]?: Partial<ProductFormValues[Step]>
}

/** Values of a wizard filled in on every step, with optional overrides. */
function completeValues(overrides: FormOverrides = {}): ProductFormValues {
  return {
    basics: {
      ...PRODUCT_FORM_DEFAULTS.basics,
      name: "MacBook Pro 14",
      sku: "MBP14M3PRO",
      description: "M3 Pro, 18 GB RAM",
      manufacturer: "Apple",
      category: "Komputery",
      features: ["WiFI", "USB-C"],
      ...overrides.basics,
    },
    pricing: {
      ...PRODUCT_FORM_DEFAULTS.pricing,
      priceNet: 8000,
      priceGross: 9840,
      ...overrides.pricing,
    },
    availability: {
      ...PRODUCT_FORM_DEFAULTS.availability,
      ...overrides.availability,
    },
  }
}

describe("toProduct", () => {
  it("builds a product with the given id from complete form values", () => {
    expect(toProduct(completeValues(), "product-1")).toStrictEqual({
      id: "product-1",
      name: "MacBook Pro 14",
      sku: "MBP14M3PRO",
      description: "M3 Pro, 18 GB RAM",
      manufacturer: "Apple",
      category: "Komputery",
      features: ["WiFI", "USB-C"],
      priceNet: 8000,
      priceGross: 9840,
      vatRate: 23,
      currency: "PLN",
      isAvailable: true,
      isLimited: false,
      minPerCart: 1,
      maxPerCart: 10,
    })
  })

  it("keeps the chosen VAT rate, currency and availability", () => {
    const values = completeValues({
      pricing: { priceNet: 100, priceGross: 108, vatRate: 8, currency: "EUR" },
      availability: { isAvailable: false },
    })

    expect(toProduct(values, "product-1")).toMatchObject({
      vatRate: 8,
      currency: "EUR",
      isAvailable: false,
    })
  })

  it("trims whitespace around the name, SKU and description", () => {
    const values = completeValues({
      basics: {
        name: "  MacBook Pro 14  ",
        sku: " MBP14M3PRO ",
        description: "  M3 Pro, 18 GB RAM\n",
      },
    })

    expect(toProduct(values, "product-1")).toMatchObject({
      name: "MacBook Pro 14",
      sku: "MBP14M3PRO",
      description: "M3 Pro, 18 GB RAM",
    })
  })

  it("keeps the stock quantity of a limited product", () => {
    const values = completeValues({
      availability: { isLimited: true, stockQuantity: 5 },
    })

    expect(toProduct(values, "product-1")).toMatchObject({
      isLimited: true,
      stockQuantity: 5,
    })
  })

  it("drops a stock quantity left over after unchecking limited", () => {
    const values = completeValues({
      availability: { isLimited: false, stockQuantity: 7 },
    })

    const product = toProduct(values, "product-1")

    expect(product.isLimited).toBe(false)
    expect(product).not.toHaveProperty("stockQuantity")
  })

  it("rounds prices to whole cents", () => {
    const values = completeValues({
      pricing: { priceNet: 1234.5678, priceGross: 99.999 },
    })

    expect(toProduct(values, "product-1")).toMatchObject({
      priceNet: 1234.57,
      priceGross: 100,
    })
  })

  it.each<{ case: string; overrides: FormOverrides }>([
    {
      case: "no manufacturer is selected",
      overrides: { basics: { manufacturer: null } },
    },
    {
      case: "the net price is empty",
      overrides: { pricing: { priceNet: null } },
    },
    {
      case: "a limited product has no stock quantity",
      overrides: { availability: { isLimited: true, stockQuantity: null } },
    },
  ])("refuses to build a product when $case", ({ overrides }) => {
    expect(() => toProduct(completeValues(overrides), "product-1")).toThrow(
      ZodError
    )
  })
})

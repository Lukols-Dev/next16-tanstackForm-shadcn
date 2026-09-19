import { z } from "zod"

import {
  CATEGORIES,
  CURRENCIES,
  MANUFACTURERS,
  PRODUCT_FEATURES,
  VAT_RATES,
} from "@/entities/product"
import { messages } from "@/messages"

const e = messages.productForm.errors

export function createBasicsSchema(existingSkus: ReadonlySet<string>) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: e.name.required })
      .min(3, { error: e.name.tooShort }),
    sku: z
      .string()
      .trim()
      .min(1, { error: e.sku.required })
      .regex(/^[A-Za-z0-9]+$/, { error: e.sku.pattern })
      .max(24, { error: e.sku.tooLong })
      .refine((sku) => !existingSkus.has(sku.toUpperCase()), {
        error: e.sku.duplicate,
      }),
    description: z.string(),
    manufacturer: z.enum(MANUFACTURERS, { error: e.manufacturer.required }),
    category: z.enum(CATEGORIES, { error: e.category.required }),
    features: z
      .array(z.enum(PRODUCT_FEATURES))
      .min(1, { error: e.features.required }),
  })
}

export const pricingSchema = z.object({
  priceNet: z
    .number({ error: e.priceNet.required })
    .positive({ error: e.priceNet.positive }),
  priceGross: z
    .number({ error: e.priceGross.required })
    .positive({ error: e.priceGross.positive }),
  vatRate: z.literal(VAT_RATES, { error: e.vatRate.required }),
  currency: z.enum(CURRENCIES, { error: e.currency.required }),
})

const quantity = (errors: { required: string; integer: string }) =>
  z.number({ error: errors.required }).int({ error: errors.integer })

export const availabilitySchema = z
  .object({
    isAvailable: z.boolean(),
    isLimited: z.boolean(),
    stockQuantity: z.number().nullable(),
    minPerCart: quantity(e.minPerCart).min(1, { error: e.minPerCart.min }),
    maxPerCart: quantity(e.maxPerCart),
  })
  .superRefine(
    (value, ctx) => {
      if (value.isLimited) {
        const stock = value.stockQuantity
        const message =
          stock === null
            ? e.stockQuantity.required
            : !Number.isInteger(stock)
              ? e.stockQuantity.integer
              : stock < 0
                ? e.stockQuantity.negative
                : undefined
        if (message) {
          ctx.addIssue({ code: "custom", path: ["stockQuantity"], message })
        }
      }
      const { minPerCart: min, maxPerCart: max } = value
      if (typeof min === "number" && typeof max === "number" && min > max) {
        ctx.addIssue({
          code: "custom",
          path: ["minPerCart"],
          message: e.minPerCart.tooHigh,
        })
        ctx.addIssue({
          code: "custom",
          path: ["maxPerCart"],
          message: e.maxPerCart.tooLow,
        })
      }
    },
    { when: () => true }
  )

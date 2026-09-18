import { z } from "zod"

import {
  CATEGORIES,
  CURRENCIES,
  MANUFACTURERS,
  PRODUCT_FEATURES,
  VAT_RATES,
} from "./catalogs"

const productBaseSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  sku: z.string().regex(/^[A-Za-z0-9]{1,24}$/),
  description: z.string(),
  manufacturer: z.enum(MANUFACTURERS),
  category: z.enum(CATEGORIES),
  features: z.array(z.enum(PRODUCT_FEATURES)).min(1),
  priceNet: z.number().nonnegative(),
  priceGross: z.number().nonnegative(),
  vatRate: z.literal(VAT_RATES),
  currency: z.enum(CURRENCIES),
  isAvailable: z.boolean(),
  minPerCart: z.int().nonnegative(),
  maxPerCart: z.int().nonnegative(),
})

export const productSchema = z.discriminatedUnion("isLimited", [
  productBaseSchema.extend({ isLimited: z.literal(false) }),
  productBaseSchema.extend({
    isLimited: z.literal(true),
    stockQuantity: z.int().nonnegative(),
  }),
])

export type Product = z.output<typeof productSchema>

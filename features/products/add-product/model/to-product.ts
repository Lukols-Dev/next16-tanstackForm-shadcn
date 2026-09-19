import { productSchema, roundMoney, type Product } from "@/entities/product"

import type { ProductFormValues } from "./form-values"

export function toProduct(values: ProductFormValues, id: string): Product {
  const { basics, pricing, availability } = values

  return productSchema.parse({
    id,
    name: basics.name.trim(),
    sku: basics.sku.trim(),
    description: basics.description.trim(),
    manufacturer: basics.manufacturer,
    category: basics.category,
    features: basics.features,
    priceNet: pricing.priceNet === null ? null : roundMoney(pricing.priceNet),
    priceGross:
      pricing.priceGross === null ? null : roundMoney(pricing.priceGross),
    vatRate: pricing.vatRate,
    currency: pricing.currency,
    isAvailable: availability.isAvailable,
    minPerCart: availability.minPerCart,
    maxPerCart: availability.maxPerCart,
    ...(availability.isLimited
      ? { isLimited: true, stockQuantity: availability.stockQuantity }
      : { isLimited: false }),
  })
}

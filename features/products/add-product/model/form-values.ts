import type {
  Category,
  Currency,
  Manufacturer,
  ProductFeature,
  VatRate,
} from "@/entities/product"

export type ProductFormValues = {
  basics: {
    name: string
    sku: string
    description: string
    manufacturer: Manufacturer | null
    category: Category | null
    features: ProductFeature[]
  }
  pricing: {
    priceNet: number | null
    priceGross: number | null
    vatRate: VatRate
    currency: Currency
  }
  availability: {
    isAvailable: boolean
    isLimited: boolean
    stockQuantity: number | null
    minPerCart: number | null
    maxPerCart: number | null
  }
}

export const PRODUCT_FORM_DEFAULTS: ProductFormValues = {
  basics: {
    name: "",
    sku: "",
    description: "",
    manufacturer: null,
    category: null,
    features: [],
  },
  pricing: { priceNet: null, priceGross: null, vatRate: 23, currency: "PLN" },
  availability: {
    isAvailable: true,
    isLimited: false,
    stockQuantity: null,
    minPerCart: 1,
    maxPerCart: 10,
  },
}

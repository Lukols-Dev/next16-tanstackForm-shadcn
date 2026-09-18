export const CATEGORIES = [
  "Komputery",
  "Telefony",
  "RTV",
  "AGD",
  "Akcesoria",
] as const
export type Category = (typeof CATEGORIES)[number]

export const MANUFACTURERS = [
  "Apple",
  "Samsung",
  "Sony",
  "Bosch",
  "Xiaomi",
  "Dell",
  "Philips",
  "LG",
] as const
export type Manufacturer = (typeof MANUFACTURERS)[number]

export const PRODUCT_FEATURES = [
  "Bluetooth",
  "WiFI",
  "USB-C",
  "Wodoodporny",
  "Bezprzewodowy",
  "Ekologiczny",
  "Premium",
] as const
export type ProductFeature = (typeof PRODUCT_FEATURES)[number]

export const VAT_RATES = [23, 8, 5, 0] as const
export type VatRate = (typeof VAT_RATES)[number]

export const CURRENCIES = ["PLN", "EUR", "USD", "GBP"] as const
export type Currency = (typeof CURRENCIES)[number]

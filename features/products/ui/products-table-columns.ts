import { messages } from "@/messages"

const m = messages.products.columns

export const PRODUCT_COLUMNS = [
  { id: "name", header: m.name },
  { id: "sku", header: m.sku },
  { id: "category", header: m.category },
  { id: "priceGross", header: m.priceGross },
  { id: "status", header: m.status },
  { id: "stock", header: m.stock },
] as const

export type ProductColumnId = (typeof PRODUCT_COLUMNS)[number]["id"]

import { messages } from "@/messages"

import type { Product } from "../model/product"

export function StockLevel({ product }: { product: Product }) {
  if (product.isLimited) return <>{product.stockQuantity}</>

  return (
    <>
      <span aria-hidden="true">—</span>
      <span className="sr-only">{messages.products.stock.unlimited}</span>
    </>
  )
}

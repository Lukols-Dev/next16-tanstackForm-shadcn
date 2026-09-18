import type { JSX } from "react"

import {
  AvailabilityBadge,
  formatPrice,
  StockLevel,
  type Product,
} from "@/entities/product"

import type { ProductColumnId } from "./products-table-columns"

type ProductCellProps = { column: ProductColumnId; product: Product }

export function ProductCell({
  column,
  product,
}: ProductCellProps): JSX.Element {
  switch (column) {
    case "name":
      return (
        <span className="block truncate font-medium" title={product.name}>
          {product.name}
        </span>
      )
    case "sku":
      return (
        <span className="text-xs text-muted-foreground">{product.sku}</span>
      )
    case "category":
      return <span className="text-muted-foreground">{product.category}</span>
    case "priceGross":
      return (
        <span className="font-medium tabular-nums">
          {formatPrice(product.priceGross, product.currency)}
        </span>
      )
    case "status":
      return <AvailabilityBadge isAvailable={product.isAvailable} />
    case "stock":
      return <StockLevel product={product} />
  }
}

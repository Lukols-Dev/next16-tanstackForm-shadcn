import type { ReactNode } from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AvailabilityBadge,
  formatPrice,
  StockLevel,
  type Product,
} from "@/entities/product"
import { messages } from "@/messages"

const m = messages.products.card

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="gap-2 shadow-xs [--card-spacing:--spacing(3)]">
      <CardHeader className="gap-x-2.5">
        <CardTitle className="min-w-0 truncate text-base" title={product.name}>
          {product.name}
        </CardTitle>
        <CardDescription className="text-xs">{product.sku}</CardDescription>
        <CardAction className="self-center">
          <AvailabilityBadge isAvailable={product.isAvailable} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-1 rounded-md bg-muted p-3">
          <CardDetail label={m.category}>{product.category}</CardDetail>
          <CardDetail label={m.priceGross}>
            <span className="font-medium tabular-nums">
              {formatPrice(product.priceGross, product.currency)}
            </span>
          </CardDetail>
          <CardDetail label={m.stock}>
            <StockLevel product={product} />
          </CardDetail>
        </dl>
      </CardContent>
    </Card>
  )
}

function CardDetail({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate">{children}</dd>
    </div>
  )
}

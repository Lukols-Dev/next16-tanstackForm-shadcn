import type { Product } from "@/entities/product"

import { ProductCard } from "./product-card"

export function ProductsCardList({
  products,
}: {
  products: readonly Product[]
}) {
  return (
    <ul className="flex flex-col gap-2">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

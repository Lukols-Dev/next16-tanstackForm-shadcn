"use client"

import { Suspense, useState } from "react"

import type { Product } from "@/entities/product"

import { MOCK_PRODUCTS } from "../data/mock-products"
import { ProductsHeader } from "./products-header"
import { ProductsList } from "./products-list"
import { ProductsListSkeleton } from "./products-list-skeleton"

export function ProductsView() {
  const [products] = useState<readonly Product[]>(MOCK_PRODUCTS)

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <ProductsHeader count={products.length} />
      <Suspense fallback={<ProductsListSkeleton />}>
        <ProductsList products={products} />
      </Suspense>
    </div>
  )
}

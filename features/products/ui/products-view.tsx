"use client"

import { Suspense, useMemo, useState } from "react"

import { toast } from "@/components/ui/toast"
import type { Product } from "@/entities/product"
import { messages } from "@/messages"

import { AddProductDialog } from "../add-product/ui/add-product-dialog"
import { MOCK_PRODUCTS } from "../data/mock-products"
import { ProductsHeader } from "./products-header"
import { ProductsList } from "./products-list"
import { ProductsListSkeleton } from "./products-list-skeleton"

export function ProductsView() {
  const [products, setProducts] = useState<readonly Product[]>(MOCK_PRODUCTS)
  const existingSkus = useMemo(
    () => new Set(products.map((product) => product.sku.toUpperCase())),
    [products]
  )

  function handleCreated(product: Product) {
    setProducts((current) => [...current, product])
    toast.add({ title: messages.products.toast.created, type: "success" })
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <ProductsHeader
        count={products.length}
        action={
          <AddProductDialog
            existingSkus={existingSkus}
            onCreated={handleCreated}
          />
        }
      />
      <Suspense fallback={<ProductsListSkeleton />}>
        <ProductsList products={products} />
      </Suspense>
    </div>
  )
}

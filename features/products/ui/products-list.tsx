import type { Product } from "@/entities/product"

import { useProductsPage } from "../hooks/use-products-page"
import { PAGE_SIZE } from "../model/constants"
import { clampPage, getPageCount, selectPage } from "../model/pagination"
import { ProductsCardList } from "./products-card-list"
import { ProductsPagination } from "./products-pagination"
import { ProductsTable } from "./products-table"

export function ProductsList({ products }: { products: readonly Product[] }) {
  const [requestedPage, setPage] = useProductsPage()
  const pageCount = getPageCount(products.length, PAGE_SIZE)
  const page = clampPage(requestedPage, pageCount)
  const visible = selectPage(products, page, PAGE_SIZE)

  const pagination = (
    <ProductsPagination
      page={page}
      pageCount={pageCount}
      total={products.length}
      onPageChange={setPage}
    />
  )

  return (
    <>
      <div className="hidden lg:block">
        <ProductsTable products={visible} footer={pagination} />
      </div>
      <div className="flex flex-col gap-6 lg:hidden">
        <ProductsCardList products={visible} />
        {pagination}
      </div>
    </>
  )
}

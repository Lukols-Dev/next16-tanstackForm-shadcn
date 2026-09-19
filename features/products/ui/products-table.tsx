import type { ReactNode } from "react"

import { Card, CardFooter } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Product } from "@/entities/product"
import { cn } from "@/lib/utils"

import { ProductCell } from "./product-cell"
import { PRODUCT_COLUMNS } from "./products-table-columns"

type ProductsTableProps = { products: readonly Product[]; footer: ReactNode }

export function ProductsTable({ products, footer }: ProductsTableProps) {
  return (
    <Card className="gap-0 rounded-[10px] py-0 shadow-xs">
      <Table className="table-fixed">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            {PRODUCT_COLUMNS.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  "px-4 font-normal text-muted-foreground",
                  column.id === "name" && "w-2/7"
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              {PRODUCT_COLUMNS.map((column) => (
                <TableCell key={column.id} className="h-12 px-4">
                  <ProductCell column={column.id} product={product} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CardFooter>{footer}</CardFooter>
    </Card>
  )
}

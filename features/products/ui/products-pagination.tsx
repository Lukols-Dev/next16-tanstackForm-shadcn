import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { messages } from "@/messages"

const m = messages.products.pagination

type ProductsPaginationProps = {
  page: number
  pageCount: number
  total: number
  onPageChange: (page: number) => void
}

export function ProductsPagination({
  page,
  pageCount,
  total,
  onPageChange,
}: ProductsPaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:justify-between">
      <p className="text-xs text-muted-foreground">
        {m.summary(page, pageCount, total)}
      </p>
      <Pagination aria-label={m.label} className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeftIcon data-icon="inline-start" />
              {m.prev}
            </Button>
          </PaginationItem>
          {pages.map((n) => (
            <PaginationItem key={n}>
              <Button
                size="icon"
                variant={n === page ? "default" : "ghost"}
                aria-current={n === page ? "page" : undefined}
                className="rounded-md"
                onClick={() => onPageChange(n)}
              >
                {n}
              </Button>
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              variant="ghost"
              disabled={page === pageCount}
              onClick={() => onPageChange(page + 1)}
            >
              {m.next}
              <ChevronRightIcon data-icon="inline-end" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

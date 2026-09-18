import { Skeleton } from "@/components/ui/skeleton"
import { messages } from "@/messages"

import { PAGE_SIZE } from "../model/constants"

export function ProductsListSkeleton() {
  return (
    <div role="status" aria-label={messages.products.loading}>
      <Skeleton className="hidden h-86 rounded-xl lg:block" />
      <div className="flex flex-col gap-2 lg:hidden">
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <Skeleton key={i} className="h-35 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

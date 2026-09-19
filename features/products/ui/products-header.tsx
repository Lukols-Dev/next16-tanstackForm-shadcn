import type { ReactNode } from "react"

import { messages } from "@/messages"

const m = messages.products

export function ProductsHeader({
  count,
  action,
}: {
  count: number
  action: ReactNode
}) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-xl font-semibold">{m.title}</h1>
        <p className="text-sm text-muted-foreground">{m.count(count)}</p>
      </div>
      {action}
    </header>
  )
}

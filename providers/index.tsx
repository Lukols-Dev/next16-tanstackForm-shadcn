import { NuqsAdapter } from "nuqs/adapters/next/app"
import type { ReactNode } from "react"

import { Toaster } from "@/components/ui/toast"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <Toaster>{children}</Toaster>
    </NuqsAdapter>
  )
}

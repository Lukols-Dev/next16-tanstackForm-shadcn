import type { ReactNode } from "react"

export function FieldRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 @md/field-group:grid-cols-2">
      {children}
    </div>
  )
}

import type { ReactNode } from "react"

import { FieldGroup } from "@/components/ui/field"

type StepFormProps = {
  onSubmit: () => Promise<void>
  footer: ReactNode
  children: ReactNode
}

export function StepForm({ onSubmit, footer, children }: StepFormProps) {
  return (
    <form
      noValidate
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={async (event) => {
        event.preventDefault()
        event.stopPropagation()
        const form = event.currentTarget
        await onSubmit()
        focusFirstInvalid(form)
      }}
    >
      <div
        data-step-content
        className="min-h-0 flex-1 overflow-y-auto p-4 md:py-5"
      >
        <FieldGroup className="gap-4">{children}</FieldGroup>
      </div>
      {footer}
    </form>
  )
}

function focusFirstInvalid(form: HTMLFormElement) {
  requestAnimationFrame(() => {
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  })
}

import type { ReactNode, Ref } from "react"

import { FieldGroup } from "@/components/ui/field"

type StepFormProps = {
  ref?: Ref<HTMLFormElement>
  onSubmit: () => void
  footer: ReactNode
  children: ReactNode
}

export function StepForm({ ref, onSubmit, footer, children }: StepFormProps) {
  return (
    <form
      ref={ref}
      noValidate
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onSubmit()
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

export function focusFirstInvalid(form: HTMLFormElement | null) {
  requestAnimationFrame(() => {
    form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  })
}

import type { ReactNode } from "react"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"

import { useFieldContext } from "./form-context"

export const CONTROL_CLASS = "rounded-4xl"

function firstErrorMessage(errors: readonly unknown[]): string | undefined {
  for (const error of errors) {
    if (typeof error === "string") return error
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      return error.message
    }
  }
}

export function useFieldError() {
  const field = useFieldContext<unknown>()
  const { isTouched, errors } = field.state.meta
  const message = isTouched ? firstErrorMessage(errors) : undefined
  const errorId = `${field.name}-error`

  return {
    message,
    errorId,
    controlProps: {
      "aria-invalid": message ? true : undefined,
      "aria-describedby": message ? errorId : undefined,
    },
  }
}

type FieldShellProps = {
  label: string
  htmlFor: string
  error: string | undefined
  errorId: string
  children: ReactNode
}

export function FieldShell({
  label,
  htmlFor,
  error,
  errorId,
  children,
}: FieldShellProps) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={htmlFor} className="leading-5">
        {label}
      </FieldLabel>
      {children}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  )
}

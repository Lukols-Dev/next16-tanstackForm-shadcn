import { Input } from "@/components/ui/input"

import { CONTROL_CLASS, FieldShell, useFieldError } from "../field-shell"
import { useFieldContext } from "../form-context"

export function TextField({
  label,
  placeholder,
}: {
  label: string
  placeholder?: string
}) {
  const field = useFieldContext<string>()
  const { message, errorId, controlProps } = useFieldError()

  return (
    <FieldShell
      label={label}
      htmlFor={field.name}
      error={message}
      errorId={errorId}
    >
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        placeholder={placeholder}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        className={CONTROL_CLASS}
        {...controlProps}
      />
    </FieldShell>
  )
}

import { Textarea } from "@/components/ui/textarea"

import { FieldShell, useFieldError } from "../field-shell"
import { useFieldContext } from "../form-context"

export function TextareaField({
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
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        placeholder={placeholder}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        className="resize-none rounded-md"
        {...controlProps}
      />
    </FieldShell>
  )
}

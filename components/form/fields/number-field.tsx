import { NumberField } from "@base-ui/react/number-field"

import { Input } from "@/components/ui/input"
import { APP_LOCALE } from "@/lib/locale"

import { CONTROL_CLASS, FieldShell, useFieldError } from "../field-shell"
import { useFieldContext } from "../form-context"

type NumberInputFieldProps = {
  label: string
  placeholder?: string
  format?: Intl.NumberFormatOptions
  inputMode?: "numeric" | "decimal"
}

export function NumberInputField({
  label,
  placeholder,
  format,
  inputMode = "numeric",
}: NumberInputFieldProps) {
  const field = useFieldContext<number | null>()
  const { message, errorId, controlProps } = useFieldError()

  return (
    <FieldShell
      label={label}
      htmlFor={field.name}
      error={message}
      errorId={errorId}
    >
      <NumberField.Root
        id={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        locale={APP_LOCALE}
        min={0}
        format={format}
      >
        <NumberField.Input
          render={<Input className={CONTROL_CLASS} />}
          inputMode={inputMode}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          {...controlProps}
        />
      </NumberField.Root>
    </FieldShell>
  )
}

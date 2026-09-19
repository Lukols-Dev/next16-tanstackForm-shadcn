import type { ChangeEvent } from "react"
import { NumberField } from "@base-ui/react/number-field"

import { Input } from "@/components/ui/input"
import { APP_LOCALE } from "@/lib/locale"

import { CONTROL_CLASS, FieldShell, useFieldError } from "../field-shell"
import { useFieldContext } from "../form-context"

type NumberInputFieldProps = {
  label: string
  placeholder?: string
  locale?: string
  format?: Intl.NumberFormatOptions
  inputMode?: "numeric" | "decimal"
}

export function NumberInputField({
  label,
  placeholder,
  locale = APP_LOCALE,
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
        locale={locale}
        min={0}
        format={format}
      >
        <NumberField.Input
          render={<Input className={CONTROL_CLASS} />}
          inputMode={inputMode}
          placeholder={placeholder}
          onChange={usesDecimalPoint(locale) ? commaToDecimalPoint : undefined}
          onBlur={field.handleBlur}
          {...controlProps}
        />
      </NumberField.Root>
    </FieldShell>
  )
}

function usesDecimalPoint(locale: string) {
  return new Intl.NumberFormat(locale).format(0.5).includes(".")
}

// Polish keyboards (including the numeric keypad on phones) type a comma. With a
// dot-decimal locale Base UI would drop everything after it ("99,99" → 99), so the
// comma is replaced with a dot before Base UI reads the value.
function commaToDecimalPoint(event: ChangeEvent<HTMLInputElement>) {
  const input = event.currentTarget
  if (!input.value.includes(",")) return
  const { selectionStart, selectionEnd } = input
  input.value = input.value.replaceAll(",", ".")
  input.setSelectionRange(selectionStart, selectionEnd)
}

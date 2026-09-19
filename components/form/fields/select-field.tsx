import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { CONTROL_CLASS, FieldShell, useFieldError } from "../field-shell"
import { useFieldContext } from "../form-context"

export type SelectOption<T> = { value: T; label: string }

type SelectFieldProps<T> = {
  label: string
  placeholder?: string
  options: readonly SelectOption<T>[]
  hideIcon?: boolean
}

export function SelectField<T extends string | number>({
  label,
  placeholder,
  options,
  hideIcon = false,
}: SelectFieldProps<T>) {
  const field = useFieldContext<T | null>()
  const { message, errorId, controlProps } = useFieldError()

  return (
    <FieldShell
      label={label}
      htmlFor={field.name}
      error={message}
      errorId={errorId}
    >
      <Select
        items={options}
        value={field.state.value}
        onValueChange={(value) => {
          if (value !== null) field.handleChange(value)
        }}
        onOpenChange={(open) => {
          if (!open) field.handleBlur()
        }}
      >
        <SelectTrigger
          id={field.name}
          className={cn("w-full", CONTROL_CLASS, hideIcon && "[&>svg]:hidden")}
          {...controlProps}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  )
}

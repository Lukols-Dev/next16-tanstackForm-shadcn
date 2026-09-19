import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckboxGroup } from "@base-ui/react/checkbox-group"
import { CheckIcon } from "lucide-react"

import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field"

import { useFieldError } from "../field-shell"
import { useFieldContext } from "../form-context"

type ChipsFieldProps<T extends string> = {
  label: string
  options: readonly T[]
}

export function ChipsField<T extends string>({
  label,
  options,
}: ChipsFieldProps<T>) {
  const field = useFieldContext<T[]>()
  const { message, errorId, controlProps } = useFieldError()
  const legendId = `${field.name}-legend`

  return (
    <FieldSet data-invalid={message ? true : undefined} className="gap-2">
      <FieldLegend id={legendId} variant="label" className="mb-2">
        {label}
      </FieldLegend>
      <CheckboxGroup
        aria-labelledby={legendId}
        aria-describedby={controlProps["aria-describedby"]}
        value={field.state.value}
        onValueChange={(values) =>
          field.handleChange(
            options.filter((option) => values.includes(option))
          )
        }
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <CheckboxPrimitive.Root
            key={option}
            value={option}
            nativeButton
            render={<button type="button" />}
            aria-invalid={controlProps["aria-invalid"]}
            className="inline-flex h-6 items-center gap-1 rounded-full border px-2 text-sm text-muted-foreground transition-colors outline-none not-data-checked:hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:hover:bg-primary/80"
          >
            <CheckboxPrimitive.Indicator className="[&>svg]:size-3">
              <CheckIcon />
            </CheckboxPrimitive.Indicator>
            {option}
          </CheckboxPrimitive.Root>
        ))}
      </CheckboxGroup>
      {message && <FieldError id={errorId}>{message}</FieldError>}
    </FieldSet>
  )
}

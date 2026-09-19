import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"

import { useFieldContext } from "../form-context"

export function CheckboxField({ label }: { label: string }) {
  const field = useFieldContext<boolean>()

  return (
    <Field orientation="horizontal">
      <Checkbox
        id={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
      />
      <FieldLabel htmlFor={field.name} className="leading-5">
        {label}
      </FieldLabel>
    </Field>
  )
}

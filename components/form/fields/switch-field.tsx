import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

import { useFieldContext } from "../form-context"

export function SwitchField({ label }: { label: string }) {
  const field = useFieldContext<boolean>()

  return (
    <Field orientation="horizontal">
      <Switch
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

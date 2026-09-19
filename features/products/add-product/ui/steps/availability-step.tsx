import { useRef } from "react"

import { FieldRow, withForm } from "@/components/form"
import { FieldLegend, FieldSet } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { messages } from "@/messages"

import { availabilitySchema } from "../../model/schemas"
import { productFormOptions } from "../form-options"
import { focusFirstInvalid, StepForm } from "../step-form"
import { WizardFooter } from "../wizard-footer"

const m = messages.productForm.fields

export const AvailabilityStep = withForm({
  ...productFormOptions,
  props: {} as { onBack: () => void },
  render: function AvailabilityStep({ form, onBack }) {
    const formRef = useRef<HTMLFormElement>(null)

    return (
      <form.FormGroup
        name="availability"
        validators={{ onChange: availabilitySchema }}
        onGroupSubmit={async ({ groupApi }) => {
          await groupApi.form.handleSubmit()
        }}
        onGroupSubmitInvalid={() => focusFirstInvalid(formRef.current)}
      >
        {(group) => (
          <StepForm
            ref={formRef}
            onSubmit={() => void group.handleSubmit()}
            footer={
              <WizardFooter
                isLastStep
                onBack={onBack}
                backButtonClassName="h-8 md:h-9"
              />
            }
          >
            <form.AppField name="availability.isAvailable">
              {(field) => <field.SwitchField label={m.isAvailable.label} />}
            </form.AppField>
            <Separator />
            <form.AppField name="availability.isLimited">
              {(field) => <field.CheckboxField label={m.isLimited.label} />}
            </form.AppField>
            {group.state.value.isLimited && (
              <FieldRow>
                <form.AppField name="availability.stockQuantity">
                  {(field) => (
                    <field.NumberInputField label={m.stockQuantity.label} />
                  )}
                </form.AppField>
              </FieldRow>
            )}
            <Separator />
            <FieldSet className="gap-4">
              <FieldLegend className="mb-4">{m.cartLimits.legend}</FieldLegend>
              <FieldRow>
                <form.AppField name="availability.minPerCart">
                  {(field) => (
                    <field.NumberInputField label={m.minPerCart.label} />
                  )}
                </form.AppField>
                <form.AppField name="availability.maxPerCart">
                  {(field) => (
                    <field.NumberInputField label={m.maxPerCart.label} />
                  )}
                </form.AppField>
              </FieldRow>
            </FieldSet>
          </StepForm>
        )}
      </form.FormGroup>
    )
  },
})

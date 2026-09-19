import { useMemo, useRef } from "react"

import { FieldRow, withForm, type SelectOption } from "@/components/form"
import {
  CATEGORIES,
  MANUFACTURERS,
  PRODUCT_FEATURES,
  type Category,
  type Manufacturer,
} from "@/entities/product"
import { messages } from "@/messages"

import { createBasicsSchema } from "../../model/schemas"
import { productFormOptions } from "../form-options"
import { focusFirstInvalid, StepForm } from "../step-form"
import { WizardFooter } from "../wizard-footer"

const m = messages.productForm.fields

const MANUFACTURER_OPTIONS: SelectOption<Manufacturer>[] = MANUFACTURERS.map(
  (value) => ({ value, label: value })
)
const CATEGORY_OPTIONS: SelectOption<Category>[] = CATEGORIES.map((value) => ({
  value,
  label: value,
}))

export const BasicsStep = withForm({
  ...productFormOptions,
  props: {} as { existingSkus: ReadonlySet<string>; onNext: () => void },
  render: function BasicsStep({ form, existingSkus, onNext }) {
    const schema = useMemo(
      () => createBasicsSchema(existingSkus),
      [existingSkus]
    )
    const formRef = useRef<HTMLFormElement>(null)

    return (
      <form.FormGroup
        name="basics"
        validators={{ onChange: schema }}
        onGroupSubmit={onNext}
        onGroupSubmitInvalid={() => focusFirstInvalid(formRef.current)}
      >
        {(group) => (
          <StepForm
            ref={formRef}
            onSubmit={() => void group.handleSubmit()}
            footer={<WizardFooter isLastStep={false} />}
          >
            <FieldRow>
              <form.AppField name="basics.name">
                {(field) => (
                  <field.TextField
                    label={m.name.label}
                    placeholder={m.name.placeholder}
                  />
                )}
              </form.AppField>
              <form.AppField name="basics.sku">
                {(field) => (
                  <field.TextField
                    label={m.sku.label}
                    placeholder={m.sku.placeholder}
                  />
                )}
              </form.AppField>
            </FieldRow>
            <form.AppField name="basics.description">
              {(field) => (
                <field.TextareaField
                  label={m.description.label}
                  placeholder={m.description.placeholder}
                />
              )}
            </form.AppField>
            <FieldRow>
              <form.AppField name="basics.manufacturer">
                {(field) => (
                  <field.SelectField
                    label={m.manufacturer.label}
                    placeholder={m.manufacturer.placeholder}
                    options={MANUFACTURER_OPTIONS}
                  />
                )}
              </form.AppField>
              <form.AppField name="basics.category">
                {(field) => (
                  <field.SelectField
                    label={m.category.label}
                    placeholder={m.category.placeholder}
                    options={CATEGORY_OPTIONS}
                  />
                )}
              </form.AppField>
            </FieldRow>
            <form.AppField name="basics.features">
              {(field) => (
                <field.ChipsField
                  label={m.features.label}
                  options={PRODUCT_FEATURES}
                />
              )}
            </form.AppField>
          </StepForm>
        )}
      </form.FormGroup>
    )
  },
})

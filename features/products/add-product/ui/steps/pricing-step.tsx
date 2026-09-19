import { FieldRow, withForm, type SelectOption } from "@/components/form"
import {
  CURRENCIES,
  grossToNet,
  netToGross,
  VAT_RATES,
  type Currency,
  type VatRate,
} from "@/entities/product"
import { MONEY_INPUT_LOCALE } from "@/lib/locale"
import { messages } from "@/messages"

import { pricingSchema } from "../../model/schemas"
import { productFormOptions } from "../form-options"
import { StepForm } from "../step-form"
import { WizardFooter } from "../wizard-footer"

const m = messages.productForm.fields

const VAT_OPTIONS: SelectOption<VatRate>[] = VAT_RATES.map((value) => ({
  value,
  label: `${value}%`,
}))
const CURRENCY_OPTIONS: SelectOption<Currency>[] = CURRENCIES.map((value) => ({
  value,
  label: value,
}))
const MONEY_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
}

const DERIVED = {
  dontRunListeners: true,
  dontUpdateMeta: true,
  dontValidate: true,
} as const

export const PricingStep = withForm({
  ...productFormOptions,
  props: {} as { onNext: () => void; onBack: () => void },
  render: function PricingStep({ form, onNext, onBack }) {
    return (
      <form.FormGroup
        name="pricing"
        validators={{ onChange: pricingSchema }}
        onGroupSubmit={onNext}
      >
        {(group) => (
          <StepForm
            onSubmit={() => group.handleSubmit()}
            footer={
              <WizardFooter
                isLastStep={false}
                onBack={onBack}
                backButtonClassName="md:rounded-lg md:px-2.25 md:has-data-[icon=inline-start]:pl-2.25"
              />
            }
          >
            <FieldRow>
              <form.AppField
                name="pricing.priceNet"
                listeners={{
                  onChange: ({ value, fieldApi }) => {
                    const vatRate =
                      fieldApi.form.getFieldValue("pricing.vatRate")
                    fieldApi.form.setFieldValue(
                      "pricing.priceGross",
                      value === null ? null : netToGross(value, vatRate),
                      DERIVED
                    )
                  },
                }}
              >
                {(field) => (
                  <field.NumberInputField
                    label={m.priceNet.label}
                    placeholder={m.priceNet.placeholder}
                    locale={MONEY_INPUT_LOCALE}
                    format={MONEY_FORMAT}
                    inputMode="decimal"
                  />
                )}
              </form.AppField>
              <form.AppField
                name="pricing.priceGross"
                listeners={{
                  onChange: ({ value, fieldApi }) => {
                    const vatRate =
                      fieldApi.form.getFieldValue("pricing.vatRate")
                    fieldApi.form.setFieldValue(
                      "pricing.priceNet",
                      value === null ? null : grossToNet(value, vatRate),
                      DERIVED
                    )
                  },
                }}
              >
                {(field) => (
                  <field.NumberInputField
                    label={m.priceGross.label}
                    placeholder={m.priceGross.placeholder}
                    locale={MONEY_INPUT_LOCALE}
                    format={MONEY_FORMAT}
                    inputMode="decimal"
                  />
                )}
              </form.AppField>
            </FieldRow>
            <FieldRow>
              <form.AppField
                name="pricing.vatRate"
                listeners={{
                  onChange: ({ value, fieldApi }) => {
                    const net = fieldApi.form.getFieldValue("pricing.priceNet")
                    if (net !== null) {
                      fieldApi.form.setFieldValue(
                        "pricing.priceGross",
                        netToGross(net, value),
                        DERIVED
                      )
                    }
                  },
                }}
              >
                {(field) => (
                  <field.SelectField
                    label={m.vatRate.label}
                    options={VAT_OPTIONS}
                    hideIcon
                  />
                )}
              </form.AppField>
              <form.AppField name="pricing.currency">
                {(field) => (
                  <field.SelectField
                    label={m.currency.label}
                    options={CURRENCY_OPTIONS}
                  />
                )}
              </form.AppField>
            </FieldRow>
          </StepForm>
        )}
      </form.FormGroup>
    )
  },
})

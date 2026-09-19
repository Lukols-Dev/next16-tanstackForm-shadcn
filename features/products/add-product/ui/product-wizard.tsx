import { useEffect, useRef, useState } from "react"

import { useAppForm } from "@/components/form"
import type { Product } from "@/entities/product"

import { toProduct } from "../model/to-product"
import { productFormOptions } from "./form-options"
import { AvailabilityStep } from "./steps/availability-step"
import { BasicsStep } from "./steps/basics-step"
import { PricingStep } from "./steps/pricing-step"
import { WizardStepper } from "./wizard-stepper"

const FIRST_FIELD =
  '[data-step-content] :is(input:not([type="hidden"]), textarea, button, [role="switch"])'

type ProductWizardProps = {
  existingSkus: ReadonlySet<string>
  onCreated: (product: Product) => void
}

export function ProductWizard({ existingSkus, onCreated }: ProductWizardProps) {
  const [step, setStep] = useState(0)
  const isCreated = useRef(false)
  const stepsRef = useRef<HTMLDivElement>(null)
  const previousStep = useRef(step)

  const form = useAppForm({
    ...productFormOptions,
    onSubmit: ({ value }) => {
      if (isCreated.current) return
      isCreated.current = true
      onCreated(toProduct(value, crypto.randomUUID()))
    },
  })

  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    stepsRef.current?.querySelector<HTMLElement>(FIRST_FIELD)?.focus()
  }, [step])

  return (
    <>
      <WizardStepper currentStep={step} />
      <div ref={stepsRef} className="contents">
        {step === 0 && (
          <BasicsStep
            form={form}
            existingSkus={existingSkus}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <PricingStep
            form={form}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <AvailabilityStep form={form} onBack={() => setStep(1)} />
        )}
      </div>
    </>
  )
}

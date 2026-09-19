import { useEffect, useRef, useState } from "react"

import { useAppForm } from "@/components/form"
import type { Product } from "@/entities/product"

import type { StepId } from "../model/steps"
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
  const [step, setStep] = useState<StepId>("basics")
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
        {step === "basics" && (
          <BasicsStep
            form={form}
            existingSkus={existingSkus}
            onNext={() => setStep("pricing")}
          />
        )}
        {step === "pricing" && (
          <PricingStep
            form={form}
            onBack={() => setStep("basics")}
            onNext={() => setStep("availability")}
          />
        )}
        {step === "availability" && (
          <AvailabilityStep form={form} onBack={() => setStep("pricing")} />
        )}
      </div>
    </>
  )
}

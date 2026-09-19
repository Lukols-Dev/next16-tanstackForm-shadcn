import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { messages } from "@/messages"

import { STEPS } from "../model/steps"

const m = messages.productForm

function isConnectorActive(index: number, currentStep: number) {
  return index <= currentStep && index < STEPS.length - 1
}

export function WizardStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-4 shrink-0 border-b py-6 md:mx-0 md:flex md:h-15.5 md:items-center md:px-4 md:py-0">
      <ol className="grid grid-cols-3 gap-x-4 md:flex md:items-center">
        {STEPS.map((step, index) => {
          const isComplete = index < currentStep
          const isUpcoming = index > currentStep

          return (
            <li
              key={step}
              aria-current={index === currentStep ? "step" : undefined}
              className="md:flex md:items-center md:gap-4"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-px w-17 md:block",
                    isConnectorActive(index, currentStep)
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
              )}
              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                    isUpcoming
                      ? "border bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {isComplete ? (
                    <CheckIcon aria-hidden="true" className="size-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {m.steps[step].title}
                    {isComplete && (
                      <span className="sr-only"> ({m.stepCompleted})</span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {m.steps[step].subtitle}
                  </span>
                </span>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="sr-only" aria-live="polite">
        {m.progress(currentStep + 1, STEPS.length)}:{" "}
        {m.steps[STEPS[currentStep]].title}
      </p>
    </div>
  )
}

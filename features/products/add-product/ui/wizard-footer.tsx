import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { messages } from "@/messages"

const m = messages.productForm.actions

type WizardFooterProps = {
  isLastStep: boolean
  onBack?: () => void
  backButtonClassName?: string
}

export function WizardFooter({
  isLastStep,
  onBack,
  backButtonClassName,
}: WizardFooterProps) {
  return (
    <div className="flex h-17 shrink-0 items-center justify-end gap-2 border-t bg-muted/50 px-4">
      {onBack && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(
            "mr-auto bg-transparent px-3.75 has-data-[icon=inline-start]:pl-3.75 dark:bg-transparent",
            backButtonClassName
          )}
          onClick={onBack}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          {m.back}
        </Button>
      )}
      <Button
        type="submit"
        size="lg"
        className="px-4 has-data-[icon=inline-end]:pr-4"
      >
        {isLastStep ? (
          m.submit
        ) : (
          <>
            {m.next}
            <ArrowRightIcon data-icon="inline-end" />
          </>
        )}
      </Button>
    </div>
  )
}

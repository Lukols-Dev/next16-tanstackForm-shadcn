import { PlusIcon, XIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Product } from "@/entities/product"
import { messages } from "@/messages"

import { ProductWizard } from "./product-wizard"

const m = messages.productForm.dialog

const CONTENT_CLASS =
  "flex h-dvh max-h-dvh max-w-none flex-col gap-0 overflow-hidden rounded-none p-0 sm:max-w-none md:h-auto md:max-h-[calc(100dvh-2rem)] md:max-w-180 md:rounded-[14px]"

type AddProductDialogProps = {
  existingSkus: ReadonlySet<string>
  onCreated: (product: Product) => void
}

export function AddProductDialog({
  existingSkus,
  onCreated,
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger render={<Button size="lg" className="shrink-0 px-4" />}>
        <PlusIcon />
        {messages.products.add}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className={CONTENT_CLASS}
        initialFocus={(interaction) =>
          interaction === "touch"
            ? true
            : document.getElementById("basics.name")
        }
      >
        <DialogHeader className="mx-4 shrink-0 flex-row items-center justify-between gap-4 border-b pt-6 pb-4 md:mx-0 md:h-16 md:px-4 md:py-0">
          <DialogTitle>{m.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {m.description}
          </DialogDescription>
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="-my-1.5 -mr-1.5"
              />
            }
            aria-label={m.close}
          >
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <ProductWizard
          existingSkus={existingSkus}
          onCreated={(product) => {
            onCreated(product)
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

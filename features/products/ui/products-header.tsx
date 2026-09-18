import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { messages } from "@/messages"

const m = messages.products

export function ProductsHeader({ count }: { count: number }) {
    return (
        <header className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1">
                <h1 className="text-xl font-semibold">{m.title}</h1>
                <p className="text-sm text-muted-foreground">{m.count(count)}</p>
            </div>
            <Button size="lg" className="shrink-0 px-4">
                <PlusIcon />
                {m.add}
            </Button>
        </header>
    )
}
import { Badge } from "@/components/ui/badge"
import { messages } from "@/messages"

const m = messages.products.status

export function AvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  return isAvailable ? (
    <Badge className="bg-success/10 text-success dark:bg-success/20">
      {m.available}
    </Badge>
  ) : (
    <Badge variant="destructive">{m.unavailable}</Badge>
  )
}

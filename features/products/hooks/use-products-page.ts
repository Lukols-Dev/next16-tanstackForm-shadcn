import { parseAsInteger, useQueryState } from "nuqs"

const pageParser = parseAsInteger
  .withDefault(1)
  .withOptions({ history: "push" })

export function useProductsPage() {
  return useQueryState("page", pageParser)
}

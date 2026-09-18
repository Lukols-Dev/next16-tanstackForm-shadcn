import { APP_LOCALE } from "@/lib/locale"

import type { Currency } from "../model/catalogs"

export function formatPrice(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(APP_LOCALE, {
    style: "currency",
    currency,
    currencyDisplay: "code",
    useGrouping: false,
  }).format(amount)
}

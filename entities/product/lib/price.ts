import type { VatRate } from "../model/catalogs"

// toPrecision(15) drops binary floating-point noise before rounding, so e.g.
// 16.5 * 1.23 (stored as 20.294999…) rounds half up to 20.30, not 20.29.
export function roundMoney(value: number): number {
  return Math.round(Number((value * 100).toPrecision(15))) / 100
}

export function netToGross(net: number, vatRate: VatRate): number {
  return roundMoney(net * (1 + vatRate / 100))
}

export function grossToNet(gross: number, vatRate: VatRate): number {
  return roundMoney(gross / (1 + vatRate / 100))
}

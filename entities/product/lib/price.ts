import type { VatRate } from "../model/catalogs"

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function netToGross(net: number, vatRate: VatRate): number {
  return roundMoney(net * (1 + vatRate / 100))
}

export function grossToNet(gross: number, vatRate: VatRate): number {
  return roundMoney(gross / (1 + vatRate / 100))
}

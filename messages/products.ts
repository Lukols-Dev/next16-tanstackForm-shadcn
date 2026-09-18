import { plural, type PluralForms } from "@/lib/plural"

const productForms: PluralForms = { one: "produkt", few: "produkty", many: "produktów" }

export const products = {
    title: "Produkty",
    count: (n: number) => `${n} ${plural(n, productForms)} w katalogu`,
    add: "Dodaj produkt",
    columns: {
        name: "Nazwa", sku: "SKU", category: "Kategoria",
        priceGross: "Cena Brutto", status: "Status", stock: "Magazyn",
    },
    status: { available: "Dostępny", unavailable: "Niedostępny" },
    stock: { unlimited: "Bez limitu", none: "Brak na stanie" },
    pagination: {
        summary: (page: number, total: number, count: number) =>
            `Strona ${page} z ${total} · ${count} ${plural(count, productForms)}`,
        prev: "Wstecz", next: "Dalej",
    },
    empty: "Brak produktów w katalogu",
    toast: { created: "Produkt został dodany" },
} as const

export const productForm = {
  dialog: {
    title: "Dodaj nowy produkt",
    description: "Formularz dodawania produktu w trzech krokach",
    close: "Zamknij",
  },
  steps: {
    basics: { title: "Informacje", subtitle: "Dane podstawowe" },
    pricing: { title: "Cena", subtitle: "Dane cenowe" },
    availability: { title: "Dostępność", subtitle: "Stany magazynowe" },
  },
  progress: (current: number, total: number) => `Krok ${current} z ${total}`,
  stepCompleted: "ukończony",
  actions: { back: "Wstecz", next: "Dalej", submit: "Zapisz produkt" },

  fields: {
    name: { label: "Nazwa produktu", placeholder: "np. MacBook Pro 14" },
    sku: { label: "SKU produktu", placeholder: "np. MBP14M3PRO" },
    description: {
      label: "Opis produktu",
      placeholder: "Krótki opis produktu",
    },
    manufacturer: { label: "Producent", placeholder: "Wybierz producenta" },
    category: { label: "Kategoria", placeholder: "Wybierz kategorię" },
    features: { label: "Cechy produktu" },
    priceNet: { label: "Cena netto", placeholder: "0.00" },
    priceGross: { label: "Cena brutto", placeholder: "0.00" },
    vatRate: { label: "Stawka VAT" },
    currency: { label: "Waluta" },
    isAvailable: { label: "Produkt jest dostępny" },
    isLimited: { label: "Produkt limitowany" },
    stockQuantity: { label: "Ilość na magazynie" },
    cartLimits: { legend: "Limity koszyka" },
    minPerCart: { label: "Minimalna ilość" },
    maxPerCart: { label: "Maksymalna ilość" },
  },

  errors: {
    name: {
      required: "Podaj nazwę produktu",
      tooShort: "Nazwa musi mieć minimum 3 znaki",
    },
    sku: {
      required: "Podaj SKU produktu",
      pattern: "SKU: tylko litery i cyfry, bez polskich znaków",
      tooLong: "SKU może mieć maksymalnie 24 znaki",
      duplicate: "Produkt o tym SKU już istnieje",
    },
    manufacturer: { required: "Wybierz producenta" },
    category: { required: "Wybierz kategorię" },
    features: { required: "Wybierz co najmniej jedną cechę" },
    priceNet: {
      required: "Podaj cenę netto",
      positive: "Cena musi być większa od zera",
    },
    priceGross: {
      required: "Podaj cenę brutto",
      positive: "Cena musi być większa od zera",
    },
    vatRate: { required: "Wybierz stawkę VAT" },
    currency: { required: "Wybierz walutę" },
    stockQuantity: {
      required: "Podaj ilość na magazynie",
      integer: "Podaj liczbę całkowitą",
      negative: "Ilość nie może być ujemna",
    },
    minPerCart: {
      required: "Podaj minimalną ilość",
      integer: "Podaj liczbę całkowitą",
      min: "Minimalna ilość musi wynosić co najmniej 1",
      tooHigh: "Minimalna ilość nie może być większa niż maksymalna",
    },
    maxPerCart: {
      required: "Podaj maksymalną ilość",
      integer: "Podaj liczbę całkowitą",
      tooLow: "Maksymalna ilość nie może być mniejsza niż minimalna",
    },
  },
} as const

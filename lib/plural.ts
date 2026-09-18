export type PluralForms = { one: string; few: string; many: string }

const pluralRules = new Intl.PluralRules("pl-PL")

export function plural(n: number, forms: PluralForms): string {
    const category = pluralRules.select(n)
    return category === "one" || category === "few" ? forms[category] : forms.many
}

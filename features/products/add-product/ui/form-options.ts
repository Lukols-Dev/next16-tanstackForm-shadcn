import { formOptions } from "@tanstack/react-form"

import { PRODUCT_FORM_DEFAULTS } from "../model/form-values"

export const productFormOptions = formOptions({
  defaultValues: PRODUCT_FORM_DEFAULTS,
})

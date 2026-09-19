import { createFormHook } from "@tanstack/react-form"

import { CheckboxField } from "./fields/checkbox-field"
import { ChipsField } from "./fields/chips-field"
import { NumberInputField } from "./fields/number-field"
import { SelectField } from "./fields/select-field"
import { SwitchField } from "./fields/switch-field"
import { TextField } from "./fields/text-field"
import { TextareaField } from "./fields/textarea-field"
import { fieldContext, formContext } from "./form-context"

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    NumberInputField,
    SwitchField,
    CheckboxField,
    ChipsField,
  },
  formComponents: {},
})

import type { FieldOptions } from 'vee-validate';

export type BaseFormComponentType =
  | 'Checkbox'
  | 'DefaultButton'
  | 'Input'
  | 'InputPassword'
  | 'PinInput'
  | 'PrimaryButton'
  | 'Select'
  | (Record<never, never> & string);

export type FormFieldOptions = Partial<
  FieldOptions & {
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    validateOnInput?: boolean;
    validateOnModelUpdate?: boolean;
  }
>;

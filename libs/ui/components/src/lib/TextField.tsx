import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { Description, fieldBorderStyles, FieldError, Input, Label } from './Field';
import { composeTailwindRenderProps, focusRing } from './utils';
import Textarea from 'react-textarea-autosize';

const inputStyles = tv({
  extend: focusRing,
  base: 'border rounded-md',
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    ...fieldBorderStyles.variants
  }
});

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  inputClassName?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextField(
  { label, placeholder, description, errorMessage, inputClassName, ...props }: TextFieldProps
) {
  return (
    <AriaTextField {...props} className={composeTailwindRenderProps(props.className, 'flex flex-col gap-1')}>
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} className={composeTailwindRenderProps(inputStyles, inputClassName ?? '')} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}

export const TextArea = ({ className, autoFocus, rows, name, placeholder, onKeyDown, onChange,  onBlur, value }: {
  className?: string,
  name?: string;
  placeholder?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>,
  value?: string | number | readonly string[],
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
  rows?: number;
  autoFocus?: boolean;
}) => {
  const finalClasses = composeTailwindRenderProps(className, 'px-2 py-1.5 flex-1 min-w-0 outline outline-0 text-sm border rounded-lg bg-input/40 placeholder:text-muted-foreground disabled:opacity-50')
  return <Textarea
    tabIndex={0}
    onKeyDown={onKeyDown}
    onBlur={onBlur}
    placeholder={placeholder}
    autoFocus={autoFocus}
    autoComplete="off"
    name={name}
    rows={rows ?? 1}
    value={value}
    onChange={onChange}
    className={typeof finalClasses == 'string' ? className : finalClasses('')}
  />
};

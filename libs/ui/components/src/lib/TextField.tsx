import React, { forwardRef } from 'react';
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { Description, FieldError, Input, Label, fieldBorderStyles } from './Field';
import { composeTailwindRenderProps, focusRing } from './utils';
import Textarea from 'react-textarea-autosize';

const inputStyles = tv({
  extend: focusRing,
  base: 'border-2 rounded-md',
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    ...fieldBorderStyles.variants
  }
});

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextField(
  { label, description, errorMessage, ...props }: TextFieldProps
) {
  return (
    <AriaTextField {...props} className={composeTailwindRenderProps(props.className, 'flex flex-col gap-1')}>
      {label && <Label>{label}</Label>}
      <Input className={inputStyles} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}

export const TextArea = ({ className, name, placeholder, onKeyDown, onChange, value }: {
  className?: string,
  name?: string;
  placeholder?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>,
  value?: string | number | readonly string[],
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
}) => {
  return <Textarea
    tabIndex={0}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    className={className}
    autoFocus
    spellCheck={false}
    autoComplete="off"
    autoCorrect="off"
    name={name}
    rows={1}
    value={value}
    onChange={onChange}
  />;
};

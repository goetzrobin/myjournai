import { LucideMinus, LucidePlus } from 'lucide-react';
import React from 'react';
import {
  ButtonProps,
  Group,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
  ValidationResult
} from 'react-aria-components';
import { Button, Input, Label } from '~myjournai/components';

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  onChange: (value: number) => void;
}

export function GradYearField(
  { value, onChange, label, description, errorMessage, ...props }: NumberFieldProps
) {
  return (
    <AriaNumberField value={value} onChange={onChange} formatOptions={{ useGrouping: false }} defaultValue={2025} minValue={2015}
                     maxValue={2030} step={1} {...props}>
      <Label className="sr-only">{label}</Label>
      <Group className="flex items-center">
        {renderProps => (<>
          <StepperButton slot="decrement">
            <LucideMinus aria-hidden className="size-8 place-self-center" />
          </StepperButton>
          <Input className="tabular-nums py-8 text-7xl border-0 text-center" />
          <StepperButton slot="increment">
            <LucidePlus aria-hidden className="size-8 place-self-center" />
          </StepperButton>
        </>)}
      </Group>
    </AriaNumberField>
  );
}

function StepperButton(props: ButtonProps) {
  return <Button {...props}
    variant="icon"
                 className="flex-none grid cursor-default" />;
}
